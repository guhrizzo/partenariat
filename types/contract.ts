import type { PaymentProvider } from "./payment";

export type ContractStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "signed"
  | "cancelled"
  | "expired";

export type ContractFieldValue = string | number | null;

export interface Contract {
  id: string;
  organizationId: string;
  templateId: string;
  templateVersion: number;
  clientId: string;
  status: ContractStatus;
  fieldValues: Record<string, ContractFieldValue>;
  documentHash: string | null;
  /** Token de alta entropia usado no link público de assinatura; nunca o id do documento. */
  publicToken: string;
  tokenExpiresAt: Date;
  pdfUrl: string | null;
  /** Código curto e legível por humanos, impresso no PDF para uso em /validate/[codigo]. */
  validationCode: string | null;
  /** Cobrança opcional pós-assinatura. Em reais (não centavos). Null = sem cobrança configurada. */
  paymentAmount: number | null;
  paymentProvider: PaymentProvider | null;
  createdAt: Date;
  sentAt: Date | null;
  viewedAt: Date | null;
  signedAt: Date | null;
  createdBy: string;
}
