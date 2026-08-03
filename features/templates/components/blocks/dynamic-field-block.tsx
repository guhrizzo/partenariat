"use client";

import { useState } from "react";
import { Braces } from "lucide-react";
import { CreateFieldDialog } from "@/features/templates/components/create-field-dialog";
import type { DynamicFieldBlock, FieldDefinition } from "@/types";

interface DynamicFieldBlockProps {
  block: DynamicFieldBlock;
  availableFields: FieldDefinition[];
  onChange: (block: DynamicFieldBlock) => void;
  onFieldCreated: (field: FieldDefinition) => void;
}

const CREATE_OPTION = "__create__";

export function DynamicFieldBlockComponent({
  block,
  availableFields,
  onChange,
  onFieldCreated,
}: DynamicFieldBlockProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const selectedField = availableFields.find((field) => field.key === block.fieldKey);

  function handleSelect(value: string) {
    if (value === CREATE_OPTION) {
      setCreateOpen(true);
      return;
    }
    const field = availableFields.find((candidate) => candidate.key === value);
    onChange({ ...block, fieldKey: value, placeholder: field?.label ?? value });
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-dashed border-primary/40 bg-primary/5 px-3 py-1.5">
      <Braces className="size-3.5 text-primary" />
      <select
        value={block.fieldKey}
        onChange={(event) => handleSelect(event.target.value)}
        className="bg-transparent text-sm font-medium text-primary outline-none"
      >
        {!selectedField && <option value={block.fieldKey}>{block.placeholder}</option>}
        {availableFields.map((field) => (
          <option key={field.id} value={field.key}>
            {field.label}
          </option>
        ))}
        <option value={CREATE_OPTION}>+ Criar novo campo...</option>
      </select>

      <CreateFieldDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(field) => {
          onFieldCreated(field);
          onChange({ ...block, fieldKey: field.key, placeholder: field.label });
        }}
      />
    </div>
  );
}
