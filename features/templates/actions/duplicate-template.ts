"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { duplicateTemplate } from "@/features/templates/repositories/template-repository";

interface ActionResult {
  success: boolean;
  error?: string;
  templateId?: string;
}

export async function duplicateTemplateAction(templateId: string): Promise<ActionResult> {
  const session = await verifySession();

  try {
    const duplicate = await duplicateTemplate(session.organizationId, templateId);
    revalidatePath("/templates");
    return { success: true, templateId: duplicate.id };
  } catch {
    return { success: false, error: "Não foi possível duplicar o modelo." };
  }
}
