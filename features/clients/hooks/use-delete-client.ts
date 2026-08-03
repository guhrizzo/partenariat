"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/providers/toast-provider";
import { deleteClientAction } from "@/features/clients/actions";

export function useDeleteClient(onSuccess?: () => void) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function deleteClient(clientId: string) {
    startTransition(async () => {
      const result = await deleteClientAction(clientId);
      if (!result.success) {
        toast({ title: "Erro ao remover cliente", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Cliente removido", variant: "success" });
      router.refresh();
      onSuccess?.();
    });
  }

  return { deleteClient, isPending };
}
