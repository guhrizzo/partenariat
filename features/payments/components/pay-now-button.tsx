"use client";

import { useState, useTransition } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/design-system/components/button";
import { createCheckoutPublicAction } from "@/features/payments/actions";

interface PayNowButtonProps {
  token: string;
  amount: number;
}

export function PayNowButton({ token, amount }: PayNowButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await createCheckoutPublicAction(token);
      if (!result.success || !result.checkoutUrl) {
        setError(result.error ?? "Não foi possível iniciar o pagamento.");
        return;
      }
      window.location.href = result.checkoutUrl;
    });
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 text-center">
      <p className="text-sm text-foreground-muted">Valor a pagar</p>
      <p className="text-2xl font-semibold text-foreground">
        {amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </p>
      <Button type="button" disabled={isPending} onClick={handleClick}>
        <CreditCard className="size-4" />
        {isPending ? "Abrindo pagamento..." : "Pagar agora"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
