"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/providers/toast-provider";
import { updateClientAction } from "@/features/clients/actions";
import type { CreateClientInput } from "@/schemas/client.schema";

export function useUpdateClient(onSuccess?: () => void) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function updateClient(clientId: string, input: CreateClientInput) {
    startTransition(async () => {
      const result = await updateClientAction(clientId, input);
      if (!result.success) {
        toast({ title: "Erro ao atualizar cliente", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Cliente atualizado com sucesso", variant: "success" });
      router.refresh();
      onSuccess?.();
    });
  }

  return { updateClient, isPending };
}
