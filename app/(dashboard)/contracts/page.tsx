import type { Metadata } from "next";
import { verifySession } from "@/lib/auth/dal";
import { listContracts } from "@/features/contracts/repositories/contract-repository";
import { getTemplate } from "@/features/templates/repositories/template-repository";
import { getClient } from "@/features/clients/repositories/client-repository";
import { ContractsDataTable, type ContractRow } from "@/features/contracts/components";

export const metadata: Metadata = {
  title: "Contratos — PARTENARIAT",
};

export default async function ContractsPage() {
  const session = await verifySession();
  const contracts = await listContracts(session.organizationId);

  const rows: ContractRow[] = await Promise.all(
    contracts.map(async (contract) => {
      const [template, client] = await Promise.all([
        getTemplate(session.organizationId, contract.templateId),
        getClient(session.organizationId, contract.clientId),
      ]);
      return {
        contract,
        templateName: template?.name ?? "Modelo removido",
        clientName: client?.name ?? "Cliente removido",
      };
    })
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Contratos</h1>
        <p className="text-sm text-foreground-muted">Acompanhe e gerencie seus contratos.</p>
      </div>
      <ContractsDataTable rows={rows} />
    </div>
  );
}
