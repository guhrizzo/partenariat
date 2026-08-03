import type { FieldDefinition, FieldType } from "@/types";

function systemField(key: string, label: string, type: FieldType): FieldDefinition {
  return {
    id: `system-${key}`,
    organizationId: null,
    key,
    label,
    type,
    required: false,
    options: null,
    createdAt: new Date(0),
  };
}

/**
 * Campos padrão do sistema, disponíveis para todas as organizações. Não
 * ficam no Firestore — são fixos no código e mesclados com os campos
 * customizados de cada organização em tempo de leitura.
 */
export const DEFAULT_FIELD_DEFINITIONS: FieldDefinition[] = [
  systemField("nome", "Nome", "text"),
  systemField("cpf", "CPF", "cpf"),
  systemField("empresa", "Empresa", "text"),
  systemField("cnpj", "CNPJ", "cnpj"),
  systemField("telefone", "Telefone", "phone"),
  systemField("email", "E-mail", "email"),
  systemField("valor", "Valor", "currency"),
  systemField("entrada", "Entrada", "currency"),
  systemField("parcelas", "Parcelas", "number"),
  systemField("descricao", "Descrição", "textarea"),
  systemField("prazo", "Prazo", "text"),
  systemField("dominio", "Domínio", "text"),
  systemField("hospedagem", "Hospedagem", "text"),
  systemField("cidade", "Cidade", "text"),
  systemField("estado", "Estado", "text"),
  systemField("observacoes", "Observações", "textarea"),
];
