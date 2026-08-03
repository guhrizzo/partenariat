"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/design-system/components/badge";
import { Button } from "@/design-system/components/button";
import { BlockCanvas } from "@/features/templates/components/block-canvas";
import { useBlockEditor, useSaveTemplate } from "@/features/templates/hooks";
import type { FieldDefinition, Template } from "@/types";

interface TemplateEditorProps {
  template: Template;
  organizationId: string;
  initialFields: FieldDefinition[];
}

export function TemplateEditor({ template, organizationId, initialFields }: TemplateEditorProps) {
  const [name, setName] = useState(template.name);
  const [status, setStatus] = useState(template.status);
  const [availableFields, setAvailableFields] = useState(initialFields);
  const { blocks, addBlock, updateBlock, removeBlock, duplicateBlock, reorderBlocks } =
    useBlockEditor(template.blocks);
  const { saveTemplate, isPending } = useSaveTemplate();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Button asChild variant="ghost" size="icon">
            <Link href="/templates" aria-label="Voltar para modelos">
              <ArrowLeft />
            </Link>
          </Button>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-xl font-semibold text-foreground outline-none hover:border-border focus:border-border"
          />
          <Badge variant={status === "published" ? "success" : "default"} className="shrink-0">
            {status === "published" ? "Publicado" : "Rascunho"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStatus(status === "published" ? "draft" : "published")}
          >
            {status === "published" ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            {status === "published" ? "Despublicar" : "Publicar"}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={() => saveTemplate(template.id, { name, status, blocks })}
          >
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <BlockCanvas
        blocks={blocks}
        organizationId={organizationId}
        templateId={template.id}
        availableFields={availableFields}
        onAddBlock={addBlock}
        onUpdateBlock={updateBlock}
        onRemoveBlock={removeBlock}
        onDuplicateBlock={duplicateBlock}
        onReorderBlocks={reorderBlocks}
        onFieldCreated={(field) => setAvailableFields((current) => [...current, field])}
      />
    </div>
  );
}
