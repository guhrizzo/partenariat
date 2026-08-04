"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/providers/toast-provider";
import { createContractAction } from "@/features/contracts/actions";
import type { CreateContractInput } from "@/schemas/contract.schema";

export function useCreateContract() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function createContract(input: CreateContractInput) {
    startTransition(async () => {
      const result = await createContractAction(input);
      if (!result.success || !result.contractId) {
        toast({ title: "Erro ao criar contrato", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Contrato criado com sucesso", variant: "success" });
      router.push(`/contracts/${result.contractId}`);
    });
  }

  return { createContract, isPending };
}
