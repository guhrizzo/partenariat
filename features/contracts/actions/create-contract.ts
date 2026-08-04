"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createContractSchema, type CreateContractInput } from "@/schemas/contract.schema";
import { createContract } from "@/features/contracts/repositories/contract-repository";
import { logContractEvent } from "@/features/contracts/repositories/audit-log-repository";
import { getTemplate } from "@/features/templates/repositories/template-repository";

interface ActionResult {
  success: boolean;
  error?: string;
  contractId?: string;
}

export async function createContractAction(input: CreateContractInput): Promise<ActionResult> {
  const session = await verifySession();

  const parsed = createContractSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const template = await getTemplate(session.organizationId, parsed.data.templateId);
  if (!template) {
    return { success: false, error: "Modelo não encontrado." };
  }

  try {
    const contract = await createContract(session.organizationId, session.userId, {
      templateId: template.id,
      templateVersion: template.version,
      clientId: parsed.data.clientId,
      fieldValues: parsed.data.fieldValues,
    });

    await logContractEvent(contract.id, "created", session.userId);

    revalidatePath("/contracts");
    return { success: true, contractId: contract.id };
  } catch {
    return { success: false, error: "Não foi possível criar o contrato." };
  }
}
