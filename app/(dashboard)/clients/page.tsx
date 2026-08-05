import type { Metadata } from "next";
import { verifySession } from "@/lib/auth/dal";
import { listClients } from "@/features/clients/repositories/client-repository";
import { ClientsDataTable } from "@/features/clients/components";

export const metadata: Metadata = {
  title: "Clientes — PARTENARIAT",
};

export default async function ClientsPage() {
  const session = await verifySession();
  const clients = await listClients(session.organizationId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Clientes</h1>
        <p className="text-sm text-foreground-muted">
          Gerencie os clientes vinculados aos seus contratos.
        </p>
      </div>
      <ClientsDataTable clients={clients} />
    </div>
  );
}
