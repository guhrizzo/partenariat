import "server-only";
import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/constants/firestore";
import { firestoreConverter } from "@/firebase/converters/firestore-converter";
import type { Client } from "@/types";
import type { CreateClientInput } from "@/schemas/client.schema";

const converter = firestoreConverter<Client>();

function clientsCollection() {
  return adminDb.collection(COLLECTIONS.clients).withConverter(converter);
}

/**
 * Sem `orderBy` no Firestore de propósito: uma cláusula `where` de
 * igualdade + `orderBy` em campo diferente exigiria um índice composto.
 * Para o volume esperado (pequenos negócios), ordenar em memória é
 * suficiente e evita essa dependência de deploy de índice.
 */
export async function listClients(organizationId: string): Promise<Client[]> {
  const snapshot = await clientsCollection().where("organizationId", "==", organizationId).get();

  return snapshot.docs
    .map((doc) => doc.data())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function createClient(
  organizationId: string,
  createdBy: string,
  input: CreateClientInput
): Promise<Client> {
  const ref = clientsCollection().doc();
  const client: Client = {
    id: ref.id,
    organizationId,
    createdBy,
    createdAt: new Date(),
    ...input,
  };
  await ref.set(client);
  return client;
}

async function assertOwnership(organizationId: string, clientId: string) {
  const snapshot = await clientsCollection().doc(clientId).get();
  if (!snapshot.exists || snapshot.data()?.organizationId !== organizationId) {
    throw new Error("Cliente não encontrado.");
  }
}

export async function updateClient(
  organizationId: string,
  clientId: string,
  input: CreateClientInput
): Promise<void> {
  await assertOwnership(organizationId, clientId);
  await clientsCollection().doc(clientId).update({ ...input });
}

export async function deleteClient(organizationId: string, clientId: string): Promise<void> {
  await assertOwnership(organizationId, clientId);
  await clientsCollection().doc(clientId).delete();
}
