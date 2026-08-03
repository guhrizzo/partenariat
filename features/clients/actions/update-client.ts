"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { onlyDigits } from "@/lib/validators/br-documents";
import { createClientSchema, type CreateClientInput } from "@/schemas/client.schema";
import { updateClient } from "@/features/clients/repositories/client-repository";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateClientAction(
  clientId: string,
  input: CreateClientInput
): Promise<ActionResult> {
  const session = await verifySession();

  const parsed = createClientSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await updateClient(session.organizationId, clientId, {
      ...parsed.data,
      document: onlyDigits(parsed.data.document),
      phone: parsed.data.phone?.trim() || null,
    });
  } catch {
    return { success: false, error: "Não foi possível atualizar o cliente." };
  }

  revalidatePath("/clients");
  return { success: true };
}
