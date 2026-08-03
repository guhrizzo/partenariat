/**
 * Nomes de coleções centralizados para evitar strings mágicas espalhadas
 * pelos repositórios. `members`, `signatures` e `auditLog` são subcoleções.
 */
export const COLLECTIONS = {
  organizations: "organizations",
  members: "members",
  clients: "clients",
  templates: "templates",
  fieldDefinitions: "fieldDefinitions",
  contracts: "contracts",
  signatures: "signatures",
  auditLog: "auditLog",
  notifications: "notifications",
  payments: "payments",
} as const;
