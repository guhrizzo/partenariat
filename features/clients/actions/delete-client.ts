"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { deleteClient } from "@/features/clients/repositories/client-repository";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function deleteClientAction(clientId: string): Promise<ActionResult> {
  const session = await verifySession();

  try {
    await deleteClient(session.organizationId, clientId);
  } catch {
    return { success: false, error: "Não foi possível remover o cliente." };
  }

  revalidatePath("/clients");
  return { success: true };
}
