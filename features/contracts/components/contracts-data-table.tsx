"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Badge, type BadgeProps } from "@/design-system/components/badge";
import { Button } from "@/design-system/components/button";
import { DataTable, type DataTableColumn } from "@/design-system/components/data-table";
import { SearchInput } from "@/design-system/components/search-input";
import { DeleteContractButton } from "@/features/contracts/components/delete-contract-button";
import type { Contract } from "@/types";

export interface ContractRow {
  contract: Contract;
  templateName: string;
  clientName: string;
}

const STATUS_LABEL: Record<Contract["status"], string> = {
  draft: "Rascunho",
  sent: "Enviado",
  viewed: "Visualizado",
  signed: "Assinado",
  cancelled: "Cancelado",
  expired: "Expirado",
};

const STATUS_VARIANT: Record<Contract["status"], NonNullable<BadgeProps["variant"]>> = {
  draft: "default",
  sent: "primary",
  viewed: "warning",
  signed: "success",
  cancelled: "destructive",
  expired: "destructive",
};

export function ContractsDataTable({ rows }: { rows: ContractRow[] }) {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(
      (row) =>
        row.templateName.toLowerCase().includes(query) || row.clientName.toLowerCase().includes(query)
    );
  }, [rows, search]);

  const columns: DataTableColumn<ContractRow>[] = [
    {
      key: "template",
      header: "Modelo",
      render: (row) => (
        <Link
          href={`/contracts/${row.contract.id}`}
          className="cursor-pointer font-medium text-foreground hover:text-primary hover:underline"
        >
          {row.templateName}
        </Link>
      ),
    },
    { key: "client", header: "Cliente", render: (row) => row.clientName },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.contract.status]}>{STATUS_LABEL[row.contract.status]}</Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Criado em",
      render: (row) => row.contract.createdAt.toLocaleDateString("pt-BR"),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) =>
        row.contract.status === "draft" ? (
          <div className="flex justify-end">
            <DeleteContractButton contractId={row.contract.id} label={row.templateName} />
          </div>
        ) : null,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Buscar por modelo ou cliente..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:max-w-xs"
        />
        <Button asChild>
          <Link href="/contracts/new">
            <Plus /> Novo contrato
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(row) => row.contract.id}
        emptyIcon={FileText}
        emptyTitle={rows.length === 0 ? "Nenhum contrato criado" : "Nenhum resultado encontrado"}
        emptyDescription={
          rows.length === 0 ? "Crie seu primeiro contrato para começar." : "Tente buscar por outro termo."
        }
      />
    </div>
  );
}
