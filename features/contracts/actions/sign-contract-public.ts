"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { adminStorage, adminAuth } from "@/firebase/admin";
import { sha256 } from "@/lib/security/hash";
import { extractIp } from "@/lib/security/ip";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { onlyDigits } from "@/lib/validators/br-documents";
import { signContractSchema, type SignContractInput } from "@/schemas/signature.schema";
import { getTemplate } from "@/features/templates/repositories/template-repository";
import { getClient } from "@/features/clients/repositories/client-repository";
import { getContractByToken, signContract } from "@/features/contracts/repositories/contract-repository";
import { createSignature } from "@/features/contracts/repositories/signature-repository";
import { logContractEvent } from "@/features/contracts/repositories/audit-log-repository";
import { generateContractPdf } from "@/features/contracts/lib/generate-contract-pdf";
import { sendContractSignedEmail } from "@/features/contracts/lib/contract-emails";

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Sem `verifySession()` de propósito: quem assina nunca tem conta no
 * sistema. O token de 256 bits é a única autorização. IP e user agent são
 * extraídos aqui, do request em si — nunca confiamos no que o cliente
 * manda para esses dois campos, já que são evidência forense.
 */
export async function signContractPublicAction(
  token: string,
  input: SignContractInput
): Promise<ActionResult> {
  const headerList = await headers();
  const ip = extractIp(headerList);

  const [ipLimit, tokenLimit] = await Promise.all([
    checkRateLimit(`sign:ip:${ip}`, 30, 300),
    checkRateLimit(`sign:token:${token}`, 8, 300),
  ]);
  if (!ipLimit.allowed || !tokenLimit.allowed) {
    return { success: false, error: "Muitas tentativas. Aguarde um momento e tente novamente." };
  }

  const parsed = signContractSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const contract = await getContractByToken(token);
  if (!contract) {
    return { success: false, error: "Contrato não encontrado ou link expirado." };
  }
  if (contract.status !== "sent" && contract.status !== "viewed") {
    return { success: false, error: "Este contrato não está mais disponível para assinatura." };
  }

  const template = await getTemplate(contract.organizationId, contract.templateId);
  if (!template) {
    return { success: false, error: "Modelo do contrato não encontrado." };
  }

  const userAgent = headerList.get("user-agent") ?? "unknown";

  const documentHash = sha256(
    JSON.stringify({
      blocks: template.blocks,
      fieldValues: contract.fieldValues,
      templateVersion: contract.templateVersion,
    })
  );

  const base64 = parsed.data.signatureImageDataUrl.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  // Caminho privado (não público): resolvido via signed URL quando exibido (Fase 7, no PDF).
  const path = `organizations/${contract.organizationId}/contracts/${contract.id}/signatures/${randomUUID()}.png`;
  await adminStorage.bucket().file(path).save(buffer, { contentType: "image/png" });

  const now = new Date();

  await createSignature(contract.id, {
    signerName: parsed.data.signerName,
    signerDocument: onlyDigits(parsed.data.signerDocument),
    signatureImageUrl: path,
    ip,
    userAgent,
    language: parsed.data.language,
    timezone: parsed.data.timezone,
    documentHashAtSigning: documentHash,
    contractVersionAtSigning: contract.templateVersion,
    signedAt: now,
  });

  await signContract(contract.id, documentHash);
  await logContractEvent(contract.id, "signed", null, { signerName: parsed.data.signerName, ip });

  const signedContract = { ...contract, status: "signed" as const, signedAt: now, documentHash };

  // Falha na geração do PDF não deve derrubar a assinatura em si — o
  // documento já está juridicamente assinado; o PDF pode ser regenerado depois.
  try {
    await generateContractPdf(signedContract, template);
  } catch (error) {
    console.error("Falha ao gerar PDF do contrato", contract.id, error);
  }

  try {
    const [client, adminUser] = await Promise.all([
      getClient(contract.organizationId, contract.clientId),
      adminAuth.getUser(contract.createdBy),
    ]);
    if (client && adminUser.email) {
      await sendContractSignedEmail(signedContract, client, template, adminUser.email);
      await logContractEvent(contract.id, "email_sent", null, { type: "signed" });
    }
  } catch (error) {
    console.error("Falha ao enviar e-mail de confirmação de assinatura", contract.id, error);
  }

  return { success: true };
}
