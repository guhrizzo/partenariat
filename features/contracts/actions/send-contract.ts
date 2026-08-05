"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { getContract, sendContract } from "@/features/contracts/repositories/contract-repository";
import { getTemplate } from "@/features/templates/repositories/template-repository";
import { getClient } from "@/features/clients/repositories/client-repository";
import { logContractEvent } from "@/features/contracts/repositories/audit-log-repository";
import { sendContractSentEmail } from "@/features/contracts/lib/contract-emails";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function sendContractAction(contractId: string): Promise<ActionResult> {
  const session = await verifySession();

  try {
    await sendContract(session.organizationId, contractId);
    await logContractEvent(contractId, "sent", session.userId);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Não foi possível enviar o contrato.",
    };
  }

  // Falha no e-mail não desfaz o envio do contrato — o link já é válido.
  try {
    const contract = await getContract(session.organizationId, contractId);
    if (contract) {
      const [template, client] = await Promise.all([
        getTemplate(session.organizationId, contract.templateId),
        getClient(session.organizationId, contract.clientId),
      ]);
      if (template && client) {
        await sendContractSentEmail(contract, client, template, session.email);
        await logContractEvent(contractId, "email_sent", session.userId, { type: "sent" });
      }
    }
  } catch (error) {
    console.error("Falha ao enviar e-mail de contrato enviado", contractId, error);
  }

  revalidatePath("/contracts");
  revalidatePath(`/contracts/${contractId}`);
  return { success: true };
}
