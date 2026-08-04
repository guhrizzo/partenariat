import "server-only";
import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/constants/firestore";
import { firestoreConverter } from "@/firebase/converters/firestore-converter";
import { generateSecureToken } from "@/lib/security/tokens";
import type { Contract, ContractFieldValue } from "@/types";

const converter = firestoreConverter<Contract>();
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function contractsCollection() {
  return adminDb.collection(COLLECTIONS.contracts).withConverter(converter);
}

export async function listContracts(organizationId: string): Promise<Contract[]> {
  const snapshot = await contractsCollection().where("organizationId", "==", organizationId).get();
  return snapshot.docs
    .map((doc) => doc.data())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

async function assertOwnership(organizationId: string, contractId: string): Promise<Contract> {
  const snapshot = await contractsCollection().doc(contractId).get();
  const data = snapshot.data();
  if (!data || data.organizationId !== organizationId) {
    throw new Error("Contrato não encontrado.");
  }
  return data;
}

export async function getContract(organizationId: string, contractId: string): Promise<Contract | null> {
  try {
    return await assertOwnership(organizationId, contractId);
  } catch {
    return null;
  }
}

interface CreateContractRepoInput {
  templateId: string;
  templateVersion: number;
  clientId: string;
  fieldValues: Record<string, ContractFieldValue>;
}

export async function createContract(
  organizationId: string,
  createdBy: string,
  input: CreateContractRepoInput
): Promise<Contract> {
  const ref = contractsCollection().doc();
  const now = new Date();
  const contract: Contract = {
    id: ref.id,
    organizationId,
    templateId: input.templateId,
    templateVersion: input.templateVersion,
    clientId: input.clientId,
    status: "draft",
    fieldValues: input.fieldValues,
    documentHash: null,
    publicToken: generateSecureToken(),
    tokenExpiresAt: new Date(now.getTime() + TOKEN_TTL_MS),
    pdfUrl: null,
    createdAt: now,
    sentAt: null,
    viewedAt: null,
    signedAt: null,
    createdBy,
  };
  await ref.set(contract);
  return contract;
}

export async function sendContract(organizationId: string, contractId: string): Promise<void> {
  const current = await assertOwnership(organizationId, contractId);
  if (current.status !== "draft") {
    throw new Error("Apenas contratos em rascunho podem ser enviados.");
  }
  await contractsCollection().doc(contractId).update({
    status: "sent",
    sentAt: new Date(),
  });
}

export async function cancelContract(organizationId: string, contractId: string): Promise<void> {
  const current = await assertOwnership(organizationId, contractId);
  if (current.status === "signed") {
    throw new Error("Contratos assinados não podem ser cancelados.");
  }
  await contractsCollection().doc(contractId).update({ status: "cancelled" });
}

export async function deleteContract(organizationId: string, contractId: string): Promise<void> {
  const current = await assertOwnership(organizationId, contractId);
  if (current.status !== "draft") {
    throw new Error("Apenas rascunhos podem ser removidos.");
  }
  await contractsCollection().doc(contractId).delete();
}
