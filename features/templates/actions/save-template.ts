"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { sanitizeHtml } from "@/lib/security/sanitize-html";
import { updateTemplate } from "@/features/templates/repositories/template-repository";
import type { Block, TemplateStatus } from "@/types";

interface ActionResult {
  success: boolean;
  error?: string;
}

interface SaveTemplateInput {
  name: string;
  status: TemplateStatus;
  blocks: Block[];
}

function sanitizeBlocks(blocks: Block[]): Block[] {
  return blocks.map((block) =>
    block.type === "paragraph" ? { ...block, html: sanitizeHtml(block.html) } : block
  );
}

export async function saveTemplateAction(
  templateId: string,
  input: SaveTemplateInput
): Promise<ActionResult> {
  const session = await verifySession();

  if (input.name.trim().length < 2) {
    return { success: false, error: "Informe um nome para o modelo." };
  }

  try {
    await updateTemplate(session.organizationId, templateId, {
      name: input.name.trim(),
      status: input.status,
      blocks: sanitizeBlocks(input.blocks),
    });
  } catch {
    return { success: false, error: "Não foi possível salvar o modelo." };
  }

  revalidatePath("/templates");
  revalidatePath(`/templates/${templateId}`);
  return { success: true };
}
