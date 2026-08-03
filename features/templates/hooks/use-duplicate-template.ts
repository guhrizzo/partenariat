"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/providers/toast-provider";
import { duplicateTemplateAction } from "@/features/templates/actions";

export function useDuplicateTemplate() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function duplicateTemplate(templateId: string) {
    startTransition(async () => {
      const result = await duplicateTemplateAction(templateId);
      if (!result.success) {
        toast({ title: "Erro ao duplicar modelo", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Modelo duplicado", variant: "success" });
      router.refresh();
    });
  }

  return { duplicateTemplate, isPending };
}
