import type { Metadata } from "next";
import { verifySession } from "@/lib/auth/dal";
import { listTemplates } from "@/features/templates/repositories/template-repository";
import { TemplatesDataTable } from "@/features/templates/components";

export const metadata: Metadata = {
  title: "Modelos — ContractFlow",
};

export default async function TemplatesPage() {
  const session = await verifySession();
  const templates = await listTemplates(session.organizationId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Modelos</h1>
        <p className="text-sm text-foreground-muted">
          Crie e edite os modelos usados para gerar seus contratos.
        </p>
      </div>
      <TemplatesDataTable templates={templates} />
    </div>
  );
}
