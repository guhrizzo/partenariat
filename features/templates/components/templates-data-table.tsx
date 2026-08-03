"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, LayoutTemplate } from "lucide-react";
import { Badge } from "@/design-system/components/badge";
import { Button } from "@/design-system/components/button";
import { DataTable, type DataTableColumn } from "@/design-system/components/data-table";
import { SearchInput } from "@/design-system/components/search-input";
import { NewTemplateDialog } from "@/features/templates/components/new-template-dialog";
import { DeleteTemplateButton } from "@/features/templates/components/delete-template-button";
import { useDuplicateTemplate } from "@/features/templates/hooks";
import type { Template } from "@/types";

export function TemplatesDataTable({ templates }: { templates: Template[] }) {
  const [search, setSearch] = React.useState("");
  const { duplicateTemplate } = useDuplicateTemplate();

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return templates;
    return templates.filter((template) => template.name.toLowerCase().includes(query));
  }, [templates, search]);

  const columns: DataTableColumn<Template>[] = [
    {
      key: "name",
      header: "Nome",
      render: (template) => (
        <Link
          href={`/templates/${template.id}`}
          className="font-medium text-foreground hover:text-primary hover:underline"
        >
          {template.name}
        </Link>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (template) => (
        <Badge variant={template.status === "published" ? "success" : "default"}>
          {template.status === "published" ? "Publicado" : "Rascunho"}
        </Badge>
      ),
    },
    { key: "blocks", header: "Blocos", render: (template) => template.blocks.length },
    {
      key: "updatedAt",
      header: "Atualizado em",
      render: (template) => template.updatedAt.toLocaleDateString("pt-BR"),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (template) => (
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Duplicar modelo"
            onClick={() => duplicateTemplate(template.id)}
          >
            <Copy className="size-4" />
          </Button>
          <DeleteTemplateButton template={template} />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Buscar modelos..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:max-w-xs"
        />
        <NewTemplateDialog />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(template) => template.id}
        emptyIcon={LayoutTemplate}
        emptyTitle={templates.length === 0 ? "Nenhum modelo criado" : "Nenhum resultado encontrado"}
        emptyDescription={
          templates.length === 0
            ? "Crie seu primeiro modelo de contrato para começar."
            : "Tente buscar por outro termo."
        }
      />
    </div>
  );
}
