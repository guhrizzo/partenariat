export type AuditEventType =
  | "created"
  | "edited"
  | "duplicated"
  | "viewed"
  | "sent"
  | "opened"
  | "signed"
  | "pdf_generated"
  | "email_sent"
  | "cancelled";

export interface AuditLogEntry {
  id: string;
  contractId: string;
  type: AuditEventType;
  /** null quando o evento é disparado pelo próprio signatário externo, sem conta no sistema */
  actorId: string | null;
  metadata: Record<string, unknown>;
  timestamp: Date;
}
