import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { getTemplate } from "@/features/templates/repositories/template-repository";
import { listCustomFieldDefinitions } from "@/features/templates/repositories/field-definition-repository";
import { DEFAULT_FIELD_DEFINITIONS } from "@/features/templates/constants/default-fields";
import { TemplateEditor } from "@/features/templates/components";

export const metadata: Metadata = {
  title: "Editar modelo — ContractFlow",
};

interface TemplateEditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function TemplateEditorPage({ params }: TemplateEditorPageProps) {
  const { id } = await params;
  const session = await verifySession();
  const template = await getTemplate(session.organizationId, id);

  if (!template) {
    notFound();
  }

  const customFields = await listCustomFieldDefinitions(session.organizationId);
  const availableFields = [...DEFAULT_FIELD_DEFINITIONS, ...customFields];

  return (
    <TemplateEditor
      template={template}
      organizationId={session.organizationId}
      initialFields={availableFields}
    />
  );
}
