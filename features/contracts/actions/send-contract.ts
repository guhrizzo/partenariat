"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { sendContract } from "@/features/contracts/repositories/contract-repository";
import { logContractEvent } from "@/features/contracts/repositories/audit-log-repository";

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

  revalidatePath("/contracts");
  revalidatePath(`/contracts/${contractId}`);
  return { success: true };
}
