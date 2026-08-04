"use client";

import { Input } from "@/design-system/components/input";
import { Label } from "@/design-system/components/label";
import type { ContractFieldValue, FieldDefinition } from "@/types";

interface ContractFieldsFormProps {
  fields: FieldDefinition[];
  values: Record<string, ContractFieldValue>;
  onChange: (key: string, value: ContractFieldValue) => void;
}

function inputTypeFor(field: FieldDefinition): string {
  switch (field.type) {
    case "email":
      return "email";
    case "date":
      return "date";
    case "number":
    case "currency":
      return "number";
    default:
      return "text";
  }
}

export function ContractFieldsForm({ fields, values, onChange }: ContractFieldsFormProps) {
  if (fields.length === 0) {
    return (
      <p className="text-sm text-foreground-muted">
        Este modelo não possui campos dinâmicos para preencher.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => {
        const type = inputTypeFor(field);
        return (
          <div key={field.id} className="flex flex-col gap-2">
            <Label htmlFor={`field-${field.key}`}>{field.label}</Label>
            <Input
              id={`field-${field.key}`}
              type={type}
              value={values[field.key] ?? ""}
              onChange={(event) => {
                const raw = event.target.value;
                onChange(field.key, type === "number" ? (raw === "" ? null : Number(raw)) : raw);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
