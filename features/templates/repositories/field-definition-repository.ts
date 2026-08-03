import "server-only";
import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/constants/firestore";
import { firestoreConverter } from "@/firebase/converters/firestore-converter";
import type { FieldDefinition } from "@/types";
import type { CreateFieldDefinitionInput } from "@/schemas/field-definition.schema";

const converter = firestoreConverter<FieldDefinition>();

function fieldDefinitionsCollection() {
  return adminDb.collection(COLLECTIONS.fieldDefinitions).withConverter(converter);
}

export async function listCustomFieldDefinitions(organizationId: string): Promise<FieldDefinition[]> {
  const snapshot = await fieldDefinitionsCollection()
    .where("organizationId", "==", organizationId)
    .get();

  return snapshot.docs.map((doc) => doc.data()).sort((a, b) => a.label.localeCompare(b.label));
}

export async function createFieldDefinition(
  organizationId: string,
  input: CreateFieldDefinitionInput
): Promise<FieldDefinition> {
  const ref = fieldDefinitionsCollection().doc();
  const field: FieldDefinition = {
    id: ref.id,
    organizationId,
    createdAt: new Date(),
    ...input,
  };
  await ref.set(field);
  return field;
}
