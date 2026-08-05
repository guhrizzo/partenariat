"use server";

import { verifySession } from "@/lib/auth/dal";
import { getContract } from "@/features/contracts/repositories/contract-repository";
import { getTemplate } from "@/features/templates/repositories/template-repository";
import { getClient } from "@/features/clients/repositories/client-repository";
import { logContractEvent } from "@/features/contracts/repositories/audit-log-repository";
import { sendContractSentEmail } from "@/features/contracts/lib/contract-emails";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function remindContractAction(contractId: string): Promise<ActionResult> {
  const session = await verifySession();

  const contract = await getContract(session.organizationId, contractId);
  if (!contract) {
    return { success: false, error: "Contrato não encontrado." };
  }
  if (contract.status !== "sent" && contract.status !== "viewed") {
    return { success: false, error: "Só é possível lembrar contratos aguardando assinatura." };
  }

  const [template, client] = await Promise.all([
    getTemplate(session.organizationId, contract.templateId),
    getClient(session.organizationId, contract.clientId),
  ]);
  if (!template || !client) {
    return { success: false, error: "Não foi possível carregar os dados do contrato." };
  }

  await sendContractSentEmail(contract, client, template, session.email, "reminder");
  await logContractEvent(contractId, "email_sent", session.userId, { type: "reminder" });

  return { success: true };
}
