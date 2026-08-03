"use server";

import { verifySession } from "@/lib/auth/dal";
import { createFieldDefinitionSchema, type CreateFieldDefinitionInput } from "@/schemas/field-definition.schema";
import { createFieldDefinition } from "@/features/templates/repositories/field-definition-repository";
import type { FieldDefinition } from "@/types";

interface ActionResult {
  success: boolean;
  error?: string;
  field?: FieldDefinition;
}

export async function createFieldDefinitionAction(
  input: CreateFieldDefinitionInput
): Promise<ActionResult> {
  const session = await verifySession();

  const parsed = createFieldDefinitionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    const field = await createFieldDefinition(session.organizationId, parsed.data);
    return { success: true, field };
  } catch {
    return { success: false, error: "Não foi possível criar o campo." };
  }
}
