import type { Metadata } from "next";
import { verifySession } from "@/lib/auth/dal";
import { listTemplates } from "@/features/templates/repositories/template-repository";
import { listCustomFieldDefinitions } from "@/features/templates/repositories/field-definition-repository";
import { DEFAULT_FIELD_DEFINITIONS } from "@/features/templates/constants/default-fields";
import { listClients } from "@/features/clients/repositories/client-repository";
import { ContractWizard } from "@/features/contracts/components";

export const metadata: Metadata = {
  title: "Novo contrato — ContractFlow",
};

export default async function NewContractPage() {
  const session = await verifySession();

  const [templates, clients, customFields] = await Promise.all([
    listTemplates(session.organizationId),
    listClients(session.organizationId),
    listCustomFieldDefinitions(session.organizationId),
  ]);

  const publishedTemplates = templates.filter((template) => template.status === "published");
  const availableFields = [...DEFAULT_FIELD_DEFINITIONS, ...customFields];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Novo contrato</h1>
        <p className="text-sm text-foreground-muted">
          Selecione um modelo publicado, um cliente e preencha os campos do contrato.
        </p>
      </div>
      <ContractWizard templates={publishedTemplates} clients={clients} availableFields={availableFields} />
    </div>
  );
}
