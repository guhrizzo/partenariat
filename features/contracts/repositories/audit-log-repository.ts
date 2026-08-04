import "server-only";
import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/constants/firestore";
import type { AuditEventType } from "@/types";

export async function logContractEvent(
  contractId: string,
  type: AuditEventType,
  actorId: string | null,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  const ref = adminDb
    .collection(COLLECTIONS.contracts)
    .doc(contractId)
    .collection(COLLECTIONS.auditLog)
    .doc();

  await ref.set({
    id: ref.id,
    contractId,
    type,
    actorId,
    metadata,
    timestamp: new Date(),
  });
}
