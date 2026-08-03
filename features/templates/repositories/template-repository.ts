import "server-only";
import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/constants/firestore";
import { firestoreConverter } from "@/firebase/converters/firestore-converter";
import type { Block, Template, TemplateStatus } from "@/types";

const converter = firestoreConverter<Template>();

function templatesCollection() {
  return adminDb.collection(COLLECTIONS.templates).withConverter(converter);
}

export async function listTemplates(organizationId: string): Promise<Template[]> {
  const snapshot = await templatesCollection().where("organizationId", "==", organizationId).get();
  return snapshot.docs
    .map((doc) => doc.data())
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

async function assertOwnership(organizationId: string, templateId: string): Promise<Template> {
  const snapshot = await templatesCollection().doc(templateId).get();
  const data = snapshot.data();
  if (!data || data.organizationId !== organizationId) {
    throw new Error("Modelo não encontrado.");
  }
  return data;
}

export async function getTemplate(organizationId: string, templateId: string): Promise<Template | null> {
  try {
    return await assertOwnership(organizationId, templateId);
  } catch {
    return null;
  }
}

export async function createTemplate(organizationId: string, name: string): Promise<Template> {
  const ref = templatesCollection().doc();
  const now = new Date();
  const template: Template = {
    id: ref.id,
    organizationId,
    name,
    status: "draft",
    blocks: [],
    version: 1,
    favoriteCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(template);
  return template;
}

interface UpdateTemplateInput {
  name: string;
  status: TemplateStatus;
  blocks: Block[];
}

export async function updateTemplate(
  organizationId: string,
  templateId: string,
  input: UpdateTemplateInput
): Promise<void> {
  const current = await assertOwnership(organizationId, templateId);

  await templatesCollection()
    .doc(templateId)
    .update({
      name: input.name,
      status: input.status,
      blocks: input.blocks,
      version: current.version + 1,
      updatedAt: new Date(),
    });
}

export async function duplicateTemplate(organizationId: string, templateId: string): Promise<Template> {
  const original = await assertOwnership(organizationId, templateId);
  const ref = templatesCollection().doc();
  const now = new Date();
  const duplicate: Template = {
    ...original,
    id: ref.id,
    name: `${original.name} (cópia)`,
    status: "draft",
    version: 1,
    favoriteCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(duplicate);
  return duplicate;
}

export async function deleteTemplate(organizationId: string, templateId: string): Promise<void> {
  await assertOwnership(organizationId, templateId);
  await templatesCollection().doc(templateId).delete();
}
