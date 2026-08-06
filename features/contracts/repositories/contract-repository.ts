import "server-only";
import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/constants/firestore";
import { firestoreConverter } from "@/firebase/converters/firestore-converter";
import { generateSecureToken } from "@/lib/security/tokens";
import type { Contract, ContractFieldValue, PaymentProvider } from "@/types";

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

/**
 * Busca pública por token — sem `organizationId`, o token de 256 bits É a
 * autorização. Contratos em `draft` nunca foram enviados, então tratamos
 * como inexistentes para não vazar a existência de rascunhos. Expiração é
 * checada de forma preguiçosa (na leitura), sem depender de um job agendado.
 */
export async function getContractByToken(token: string): Promise<Contract | null> {
  const snapshot = await contractsCollection().where("publicToken", "==", token).limit(1).get();
  if (snapshot.empty) return null;

  const contract = snapshot.docs[0].data();
  if (contract.status === "draft") return null;

  const isExpirable = contract.status === "sent" || contract.status === "viewed";
  if (isExpirable && contract.tokenExpiresAt.getTime() < Date.now()) {
    await contractsCollection().doc(contract.id).update({ status: "expired" });
    return { ...contract, status: "expired" };
  }

  return contract;
}

/** Idempotente: só transiciona de "sent" para "viewed", nunca regride um status mais avançado. */
export async function markContractViewed(contractId: string): Promise<void> {
  const ref = contractsCollection().doc(contractId);
  const snapshot = await ref.get();
  if (snapshot.data()?.status === "sent") {
    await ref.update({ status: "viewed", viewedAt: new Date() });
  }
}

export async function signContract(contractId: string, documentHash: string): Promise<void> {
  const ref = contractsCollection().doc(contractId);
  const snapshot = await ref.get();
  const data = snapshot.data();
  if (!data || (data.status !== "sent" && data.status !== "viewed")) {
    throw new Error("Este contrato não pode mais ser assinado.");
  }
  await ref.update({ status: "signed", signedAt: new Date(), documentHash });
}

interface CreateContractRepoInput {
  templateId: string;
  templateVersion: number;
  clientId: string;
  fieldValues: Record<string, ContractFieldValue>;
  paymentAmount: number | null;
  paymentProvider: PaymentProvider | null;
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
    validationCode: null,
    paymentAmount: input.paymentAmount,
    paymentProvider: input.paymentProvider,
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

/**
 * Contratos assinados nunca podem ser removidos — são o registro/evidência
 * da assinatura (e de eventual pagamento). Qualquer outro status pode.
 * `recursiveDelete` também limpa as subcoleções `signatures`/`auditLog`
 * do contrato; nos status permitidos aqui elas nunca chegam a existir
 * (só são criadas a partir de `signed`), mas evita órfãos se isso mudar.
 */
export async function deleteContract(organizationId: string, contractId: string): Promise<void> {
  const current = await assertOwnership(organizationId, contractId);
  if (current.status === "signed") {
    throw new Error("Contratos assinados não podem ser removidos — cancele-os, se necessário.");
  }
  await adminDb.recursiveDelete(contractsCollection().doc(contractId));
}

/** Página pública /validate/[codigo] — o código é público por natureza (impresso no PDF), sem `organizationId`. */
export async function getContractByValidationCode(code: string): Promise<Contract | null> {
  const snapshot = await contractsCollection().where("validationCode", "==", code).limit(1).get();
  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
}

export async function setContractPdf(
  contractId: string,
  pdfUrl: string,
  validationCode: string
): Promise<void> {
  await contractsCollection().doc(contractId).update({ pdfUrl, validationCode });
}
