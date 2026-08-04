"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/providers/toast-provider";
import { deleteContractAction } from "@/features/contracts/actions";

export function useDeleteContract(onSuccess?: () => void) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function deleteContract(contractId: string) {
    startTransition(async () => {
      const result = await deleteContractAction(contractId);
      if (!result.success) {
        toast({ title: "Erro ao remover contrato", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Contrato removido", variant: "success" });
      router.refresh();
      onSuccess?.();
    });
  }

  return { deleteContract, isPending };
}
