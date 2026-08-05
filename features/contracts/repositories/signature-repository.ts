import "server-only";
import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/constants/firestore";
import { firestoreConverter } from "@/firebase/converters/firestore-converter";
import type { Signature } from "@/types";

const converter = firestoreConverter<Signature>();

function signaturesCollection(contractId: string) {
  return adminDb
    .collection(COLLECTIONS.contracts)
    .doc(contractId)
    .collection(COLLECTIONS.signatures)
    .withConverter(converter);
}

export async function createSignature(
  contractId: string,
  input: Omit<Signature, "id" | "contractId">
): Promise<Signature> {
  const ref = signaturesCollection(contractId).doc();
  const signature: Signature = {
    id: ref.id,
    contractId,
    ...input,
  };
  await ref.set(signature);
  return signature;
}

export async function listSignatures(contractId: string): Promise<Signature[]> {
  const snapshot = await signaturesCollection(contractId).get();
  return snapshot.docs
    .map((doc) => doc.data())
    .sort((a, b) => a.signedAt.getTime() - b.signedAt.getTime());
}
