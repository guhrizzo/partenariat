export interface CreateCheckoutInput {
  amount: number;
  description: string;
  /** Usado pelo webhook para religar a notificação ao Payment local. */
  externalReference: string;
  successUrl: string;
}

export interface CreateCheckoutResult {
  checkoutUrl: string;
  providerRef: string;
}

/** Toda integração de pagamento implementa isto — é o que deixa plugar Stripe depois sem tocar no resto do fluxo. */
export interface PaymentProviderAdapter {
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>;
}
