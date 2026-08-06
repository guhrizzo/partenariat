import "server-only";
import type { CreateCheckoutInput, CreateCheckoutResult, PaymentProviderAdapter } from "./payment-provider";

const MERCADOPAGO_API_URL = "https://api.mercadopago.com/checkout/preferences";

function getAccessToken(): string {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Mercado Pago não configurado: defina MERCADOPAGO_ACCESS_TOKEN.");
  }
  return token;
}

interface MercadoPagoPreferenceResponse {
  id: string;
  init_point: string;
}

/**
 * Usa a API REST direta (sem SDK) — Checkout Pro do Mercado Pago já
 * oferece Pix, cartão e boleto automaticamente para contas brasileiras,
 * então uma única integração cobre "PIX" e "Mercado Pago" do escopo.
 */
export const mercadoPagoProvider: PaymentProviderAdapter = {
  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    const accessToken = getAccessToken();

    const response = await fetch(MERCADOPAGO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: input.description,
            quantity: 1,
            unit_price: input.amount,
            currency_id: "BRL",
          },
        ],
        external_reference: input.externalReference,
        back_urls: {
          success: input.successUrl,
          pending: input.successUrl,
          failure: input.successUrl,
        },
        auto_return: "approved",
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Falha ao criar checkout no Mercado Pago (${response.status}): ${errorBody}`);
    }

    const data = (await response.json()) as MercadoPagoPreferenceResponse;
    return { checkoutUrl: data.init_point, providerRef: data.id };
  },
};
