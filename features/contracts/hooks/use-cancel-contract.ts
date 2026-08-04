"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/providers/toast-provider";
import { cancelContractAction } from "@/features/contracts/actions";

export function useCancelContract() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function cancelContract(contractId: string) {
    startTransition(async () => {
      const result = await cancelContractAction(contractId);
      if (!result.success) {
        toast({ title: "Erro ao cancelar contrato", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Contrato cancelado", variant: "success" });
      router.refresh();
    });
  }

  return { cancelContract, isPending };
}
