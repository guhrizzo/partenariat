"use client";

import * as React from "react";
import { Plus, Users } from "lucide-react";
import { Badge } from "@/design-system/components/badge";
import { Button } from "@/design-system/components/button";
import { DataTable, type DataTableColumn } from "@/design-system/components/data-table";
import { SearchInput } from "@/design-system/components/search-input";
import { ClientDialog } from "@/features/clients/components/client-dialog";
import { DeleteClientButton } from "@/features/clients/components/delete-client-button";
import { formatDocument, onlyDigits } from "@/lib/validators/br-documents";
import type { Client } from "@/types";

export function ClientsDataTable({ clients }: { clients: Client[] }) {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;
    const queryDigits = onlyDigits(query);
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        (queryDigits.length > 0 && client.document.includes(queryDigits))
    );
  }, [clients, search]);

  const columns: DataTableColumn<Client>[] = [
    {
      key: "name",
      header: "Nome",
      render: (client) => <span className="font-medium">{client.name}</span>,
    },
    {
      key: "document",
      header: "Documento",
      render: (client) => (
        <div className="flex items-center gap-2">
          <Badge variant="primary">{client.documentType.toUpperCase()}</Badge>
          <span>{formatDocument(client.document, client.documentType)}</span>
        </div>
      ),
    },
    { key: "email", header: "E-mail", render: (client) => client.email },
    { key: "phone", header: "Telefone", render: (client) => client.phone ?? "—" },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (client) => (
        <div className="flex justify-end gap-1">
          <ClientDialog
            client={client}
            trigger={
              <Button type="button" variant="ghost" size="sm">
                Editar
              </Button>
            }
          />
          <DeleteClientButton client={client} />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Buscar por nome, e-mail ou documento..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:max-w-xs"
        />
        <ClientDialog
          trigger={
            <Button type="button">
              <Plus />
              Novo cliente
            </Button>
          }
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(client) => client.id}
        emptyIcon={Users}
        emptyTitle={clients.length === 0 ? "Nenhum cliente cadastrado" : "Nenhum resultado encontrado"}
        emptyDescription={
          clients.length === 0
            ? "Cadastre seu primeiro cliente para começar a gerar contratos."
            : "Tente buscar por outro termo."
        }
      />
    </div>
  );
}
