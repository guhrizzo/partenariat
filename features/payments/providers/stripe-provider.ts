import "server-only";
import type { CreateCheckoutInput, CreateCheckoutResult, PaymentProviderAdapter } from "./payment-provider";

/**
 * Stub proposital: a arquitetura (interface `PaymentProviderAdapter`) já
 * está pronta para Stripe — basta implementar `createCheckout` com
 * `stripe.checkout.sessions.create` seguindo o mesmo contrato. Não
 * implementado nesta fase por falta de escopo confirmado com o usuário.
 */
export const stripeProvider: PaymentProviderAdapter = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- assinatura definida pela interface do adapter.
  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    throw new Error("Stripe ainda não está disponível. Use Mercado Pago por enquanto.");
  },
};
