export type NotificationType =
  | "contract_sent"
  | "contract_viewed"
  | "contract_signed"
  | "contract_expiring"
  | "contract_expired"
  | "payment_received";

export interface Notification {
  id: string;
  organizationId: string;
  userId: string;
  type: NotificationType;
  read: boolean;
  payload: Record<string, unknown>;
  createdAt: Date;
}
