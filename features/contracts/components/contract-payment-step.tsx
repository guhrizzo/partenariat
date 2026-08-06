"use client";

import { Input } from "@/design-system/components/input";
import { Label } from "@/design-system/components/label";
import type { PaymentProvider } from "@/types";

interface PaymentConfig {
  enabled: boolean;
  amount: number | null;
  provider: PaymentProvider | null;
}

interface ContractPaymentStepProps extends PaymentConfig {
  onChange: (config: PaymentConfig) => void;
}

export function ContractPaymentStep({ enabled, amount, provider, onChange }: ContractPaymentStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) =>
            onChange({
              enabled: event.target.checked,
              amount: event.target.checked ? amount : null,
              provider: event.target.checked ? (provider ?? "mercadopago") : null,
            })
          }
        />
        Cobrar pagamento após a assinatura
      </label>

      {enabled ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="paymentAmount">Valor (R$)</Label>
            <Input
              id="paymentAmount"
              type="number"
              min={0}
              step="0.01"
              value={amount ?? ""}
              onChange={(event) =>
                onChange({
                  enabled,
                  amount: event.target.value ? Number(event.target.value) : null,
                  provider,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="paymentProvider">Forma de pagamento</Label>
            <select
              id="paymentProvider"
              value={provider ?? "mercadopago"}
              onChange={(event) =>
                onChange({ enabled, amount, provider: event.target.value as PaymentProvider })
              }
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="mercadopago">Mercado Pago (Pix ou cartão)</option>
              <option value="stripe" disabled>
                Stripe (em breve)
              </option>
            </select>
          </div>
        </div>
      ) : (
        <p className="text-sm text-foreground-muted">
          Nenhuma cobrança será exibida ao cliente após a assinatura.
        </p>
      )}
    </div>
  );
}
