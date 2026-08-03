import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Users } from "lucide-react";
import { Button } from "@/design-system/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/design-system/components/card";
import { EmptyState } from "@/design-system/components/empty-state";
import { verifySession } from "@/lib/auth/dal";
import { listClients } from "@/features/clients/repositories/client-repository";

export const metadata: Metadata = {
  title: "Dashboard — ContractFlow",
};

export default async function DashboardPage() {
  const session = await verifySession();
  const firstName = (session.name ?? session.email).split(" ")[0];
  const clients = await listClients(session.organizationId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Olá, {firstName}</h1>
        <p className="text-sm text-foreground-muted">
          Aqui está um resumo da sua operação de contratos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contratos</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={FileText}
              title="Nenhum contrato ainda"
              description="Crie um modelo e gere seu primeiro contrato para começar."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Nenhum cliente cadastrado"
                description="Cadastre seus clientes para vinculá-los aos contratos."
                action={
                  <Button asChild size="sm">
                    <Link href="/clients">Cadastrar cliente</Link>
                  </Button>
                }
              />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-semibold text-foreground">{clients.length}</p>
                  <p className="text-sm text-foreground-muted">
                    {clients.length === 1 ? "cliente cadastrado" : "clientes cadastrados"}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/clients">Ver todos</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
