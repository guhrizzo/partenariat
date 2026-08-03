"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/providers/toast-provider";
import { createTemplateAction } from "@/features/templates/actions";

export function useCreateTemplate() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function createTemplate(name: string) {
    startTransition(async () => {
      const result = await createTemplateAction(name);
      if (!result.success || !result.templateId) {
        toast({ title: "Erro ao criar modelo", description: result.error, variant: "destructive" });
        return;
      }
      router.push(`/templates/${result.templateId}`);
    });
  }

  return { createTemplate, isPending };
}
