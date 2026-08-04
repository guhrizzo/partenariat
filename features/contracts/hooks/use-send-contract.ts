"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/providers/toast-provider";
import { sendContractAction } from "@/features/contracts/actions";

export function useSendContract() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function sendContract(contractId: string) {
    startTransition(async () => {
      const result = await sendContractAction(contractId);
      if (!result.success) {
        toast({ title: "Erro ao enviar contrato", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Contrato enviado", variant: "success" });
      router.refresh();
    });
  }

  return { sendContract, isPending };
}
