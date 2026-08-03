"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createTemplate } from "@/features/templates/repositories/template-repository";

interface ActionResult {
  success: boolean;
  error?: string;
  templateId?: string;
}

export async function createTemplateAction(name: string): Promise<ActionResult> {
  const session = await verifySession();

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { success: false, error: "Informe um nome para o modelo." };
  }

  try {
    const template = await createTemplate(session.organizationId, trimmed);
    revalidatePath("/templates");
    return { success: true, templateId: template.id };
  } catch {
    return { success: false, error: "Não foi possível criar o modelo." };
  }
}
