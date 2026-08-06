"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { deleteContract } from "@/features/contracts/repositories/contract-repository";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function deleteContractAction(contractId: string): Promise<ActionResult> {
  const session = await verifySession();

  try {
    await deleteContract(session.organizationId, contractId);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Não foi possível remover o contrato.",
    };
  }

  try {
    revalidatePath("/contracts");
  } catch (error) {
    console.error("Falha ao revalidar /contracts após exclusão de contrato", error);
  }

  return { success: true };
}
