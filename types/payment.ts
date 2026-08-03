export type PaymentProvider = "pix" | "mercadopago" | "stripe";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Payment {
  id: string;
  organizationId: string;
  contractId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  providerRef: string | null;
  createdAt: Date;
}
