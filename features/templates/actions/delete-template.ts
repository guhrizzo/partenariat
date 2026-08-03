"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { deleteTemplate } from "@/features/templates/repositories/template-repository";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function deleteTemplateAction(templateId: string): Promise<ActionResult> {
  const session = await verifySession();

  try {
    await deleteTemplate(session.organizationId, templateId);
  } catch {
    return { success: false, error: "Não foi possível remover o modelo." };
  }

  revalidatePath("/templates");
  return { success: true };
}
