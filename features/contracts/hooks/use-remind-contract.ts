"use client";

import { useTransition } from "react";
import { useToast } from "@/shared/providers/toast-provider";
import { remindContractAction } from "@/features/contracts/actions";

export function useRemindContract() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function remindContract(contractId: string) {
    startTransition(async () => {
      const result = await remindContractAction(contractId);
      if (!result.success) {
        toast({ title: "Erro ao enviar lembrete", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Lembrete enviado", variant: "success" });
    });
  }

  return { remindContract, isPending };
}
