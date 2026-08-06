import "server-only";
import type { PaymentProvider } from "@/types";
import type { PaymentProviderAdapter } from "./payment-provider";
import { mercadoPagoProvider } from "./mercadopago-provider";
import { stripeProvider } from "./stripe-provider";

export function getPaymentProviderAdapter(provider: PaymentProvider): PaymentProviderAdapter {
  switch (provider) {
    case "mercadopago":
    case "pix":
      // Pix é um método dentro do checkout do Mercado Pago, não uma integração à parte.
      return mercadoPagoProvider;
    case "stripe":
      return stripeProvider;
  }
}
