"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Calendar, FileText, Plus } from "lucide-react";
import { Badge, type BadgeProps } from "@/design-system/components/badge";
import { Button } from "@/design-system/components/button";
import { DataTable, type DataTableColumn } from "@/design-system/components/data-table";
import { SearchInput } from "@/design-system/components/search-input";
import { Select } from "@/design-system/components/select";
import { DeleteContractButton } from "@/features/contracts/components/delete-contract-button";
import type { Contract } from "@/types";

export interface ContractRow {
  contract: Contract;
  templateName: string;
  clientName: string;
}

const MONTH_LOCALE = "pt-BR";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = React.useState("");
  const selectedMonth = searchParams.get("month") ?? "all";

  // Extrair todos os meses únicos dos contratos recebidos
  const availableMonths = React.useMemo(() => {
    const buckets = new Map<string, { key: string; label: string; timestamp: number }>();
    for (const row of rows) {
      const date = row.contract.createdAt;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!buckets.has(key)) {
        const label = new Intl.DateTimeFormat(MONTH_LOCALE, {
          month: "long",
          year: "numeric",
        }).format(date);
        const capitalized = label.charAt(0).toUpperCase() + label.slice(1);
        buckets.set(key, {
          key,
          label: capitalized,
          timestamp: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
        });
      }
    }
    return Array.from(buckets.values()).sort((a, b) => b.timestamp - a.timestamp);
  }, [rows]);

  const handleMonthChange = (monthKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (monthKey === "all") {
      params.delete("month");
    } else {
      params.set("month", monthKey);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const filtered = React.useMemo(() => {
    let result = rows;

    // Filtro de Mês por URL
    if (selectedMonth !== "all") {
      result = result.filter((row) => {
        const date = row.contract.createdAt;
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        return key === selectedMonth;
      });
    }

    // Filtro de Pesquisa (Texto)
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (row) =>
          row.templateName.toLowerCase().includes(query) || row.clientName.toLowerCase().includes(query)
      );
    }

    return result;
  }, [rows, selectedMonth, search]);

  const grouped = React.useMemo(() => {
    const buckets = new Map<
      string,
      { key: string; label: string; timestamp: number; rows: ContractRow[] }
    >();
    for (const row of filtered) {
      const date = row.contract.createdAt;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const existing = buckets.get(key);
      if (existing) {
        existing.rows.push(row);
        continue;
      }
      const label = new Intl.DateTimeFormat(MONTH_LOCALE, {
        month: "long",
        year: "numeric",
      }).format(date);
      const capitalized = label.charAt(0).toUpperCase() + label.slice(1);
      buckets.set(key, {
        key,
        label: capitalized,
        timestamp: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
        rows: [row],
      });
    }
    return Array.from(buckets.values()).sort((a, b) => b.timestamp - a.timestamp);
  }, [filtered]);

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
      render: (row) => (
        <div className="flex justify-end">
          <DeleteContractButton contractId={row.contract.id} label={row.templateName} />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            placeholder="Buscar por modelo ou cliente..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="sm:max-w-xs"
          />
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-foreground-muted shrink-0" />
            <Select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="w-auto"
            >
              <option value="all">Todos os meses</option>
              {availableMonths.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <Button asChild>
          <Link href="/contracts/new">
            <Plus /> Novo contrato
          </Link>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <DataTable
          columns={columns}
          data={[]}
          getRowId={(row) => row.contract.id}
          emptyIcon={FileText}
          emptyTitle={rows.length === 0 ? "Nenhum contrato criado" : "Nenhum resultado encontrado"}
          emptyDescription={
            rows.length === 0 ? "Crie seu primeiro contrato para começar." : "Tente buscar por outro termo ou selecionar outro mês."
          }
        />
      ) : selectedMonth === "all" ? (
        <div className="flex flex-col gap-6">
          {grouped.map((group) => (
            <section key={group.key} className="flex flex-col gap-3">
              <header className="flex items-center gap-2 text-sm font-semibold text-foreground-muted">
                <Calendar className="size-4 text-foreground-muted" />
                <h2>{group.label}</h2>
                <span className="text-xs font-normal text-foreground-muted">
                  ({group.rows.length})
                </span>
              </header>
              <DataTable
                key={group.key}
                columns={columns}
                data={group.rows}
                getRowId={(row) => row.contract.id}
                emptyIcon={FileText}
                emptyTitle="Nenhum resultado encontrado"
                emptyDescription="Tente buscar por outro termo."
              />
            </section>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          getRowId={(row) => row.contract.id}
          emptyIcon={FileText}
          emptyTitle="Nenhum resultado encontrado"
          emptyDescription="Tente buscar por outro termo ou selecionar outro mês."
        />
      )}
    </div>
  );
}

