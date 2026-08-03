"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/providers/toast-provider";
import { deleteTemplateAction } from "@/features/templates/actions";

export function useDeleteTemplate(onSuccess?: () => void) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function deleteTemplate(templateId: string) {
    startTransition(async () => {
      const result = await deleteTemplateAction(templateId);
      if (!result.success) {
        toast({ title: "Erro ao remover modelo", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Modelo removido", variant: "success" });
      router.refresh();
      onSuccess?.();
    });
  }

  return { deleteTemplate, isPending };
}
