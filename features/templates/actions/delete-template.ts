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

  try {
    revalidatePath("/templates");
  } catch (error) {
    // A exclusão em si já foi bem-sucedida; uma falha aqui só significa que
    // o cache da listagem não foi invalidado — não deve virar erro pro
    // usuário (o `router.refresh()` do client já força uma nova busca).
    console.error("Falha ao revalidar /templates após exclusão de modelo", error);
  }

  return { success: true };
}
