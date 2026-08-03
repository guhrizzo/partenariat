export type ClientDocumentType = "cpf" | "cnpj";

export interface ClientAddress {
  street: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
}

export interface Client {
  id: string;
  organizationId: string;
  name: string;
  documentType: ClientDocumentType;
  document: string;
  email: string;
  phone: string | null;
  address: ClientAddress | null;
  createdAt: Date;
  createdBy: string;
}
