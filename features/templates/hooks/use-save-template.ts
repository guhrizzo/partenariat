"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/providers/toast-provider";
import { saveTemplateAction } from "@/features/templates/actions";
import type { Block, TemplateStatus } from "@/types";

export function useSaveTemplate() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function saveTemplate(
    templateId: string,
    input: { name: string; status: TemplateStatus; blocks: Block[] }
  ) {
    startTransition(async () => {
      const result = await saveTemplateAction(templateId, input);
      if (!result.success) {
        toast({ title: "Erro ao salvar modelo", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Modelo salvo com sucesso", variant: "success" });
      router.refresh();
    });
  }

  return { saveTemplate, isPending };
}
