"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/providers/toast-provider";
import { createClientAction } from "@/features/clients/actions";
import type { CreateClientInput } from "@/schemas/client.schema";

export function useCreateClient(onSuccess?: () => void) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function createClient(input: CreateClientInput) {
    startTransition(async () => {
      const result = await createClientAction(input);
      if (!result.success) {
        toast({ title: "Erro ao criar cliente", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Cliente criado com sucesso", variant: "success" });
      router.refresh();
      onSuccess?.();
    });
  }

  return { createClient, isPending };
}
