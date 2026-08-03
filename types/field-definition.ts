export type FieldType =
  | "text"
  | "number"
  | "currency"
  | "date"
  | "email"
  | "phone"
  | "cpf"
  | "cnpj"
  | "textarea"
  | "select";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldDefinition {
  id: string;
  /** null = campo padrão do sistema, disponível para todas as organizações */
  organizationId: string | null;
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  options: FieldOption[] | null;
  createdAt: Date;
}
