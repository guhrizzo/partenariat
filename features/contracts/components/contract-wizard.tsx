"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, LayoutTemplate, Users } from "lucide-react";
import { Button } from "@/design-system/components/button";
import { Card, CardContent } from "@/design-system/components/card";
import { EmptyState } from "@/design-system/components/empty-state";
import { BlockPreview } from "@/features/templates/components/block-preview";
import { extractFieldKeys } from "@/features/templates/lib/extract-field-keys";
import { ContractFieldsForm } from "@/features/contracts/components/contract-fields-form";
import { useCreateContract } from "@/features/contracts/hooks";
import { cn } from "@/shared/utils/cn";
import type { Client, ContractFieldValue, FieldDefinition, Template } from "@/types";

interface ContractWizardProps {
  templates: Template[];
  clients: Client[];
  availableFields: FieldDefinition[];
}

const STEPS = ["Modelo", "Cliente", "Campos", "Preview"] as const;

export function ContractWizard({ templates, clients, availableFields }: ContractWizardProps) {
  const [step, setStep] = useState(0);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, ContractFieldValue>>({});
  const { createContract, isPending } = useCreateContract();

  const template = templates.find((item) => item.id === templateId) ?? null;
  const client = clients.find((item) => item.id === clientId) ?? null;

  const requiredFields = useMemo(() => {
    if (!template) return [];
    const keys = extractFieldKeys(template.blocks);
    return keys
      .map((key) => availableFields.find((field) => field.key === key))
      .filter((field): field is FieldDefinition => Boolean(field));
  }, [template, availableFields]);

  const canAdvance = step === 0 ? Boolean(templateId) : step === 1 ? Boolean(clientId) : true;

  function handleCreate() {
    if (!template || !client) return;
    createContract({ templateId: template.id, clientId: client.id, fieldValues });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {STEPS.map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                index === step
                  ? "bg-primary text-white"
                  : index < step
                    ? "bg-primary/10 text-primary"
                    : "bg-background-subtle text-foreground-muted"
              )}
            >
              {index < step ? <Check className="size-3.5" /> : index + 1}
            </div>
            <span className={index === step ? "font-medium text-foreground" : "text-foreground-muted"}>
              {label}
            </span>
            {index < STEPS.length - 1 && <div className="mx-1 h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      {step === 0 &&
        (templates.length === 0 ? (
          <EmptyState
            icon={LayoutTemplate}
            title="Nenhum modelo publicado"
            description="Publique um modelo antes de criar um contrato."
            action={
              <Button asChild size="sm">
                <Link href="/templates">Ir para Modelos</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {templates.map((item) => (
              <button key={item.id} type="button" onClick={() => setTemplateId(item.id)} className="text-left">
                <Card
                  className={cn(
                    "cursor-pointer transition-colors hover:border-primary",
                    templateId === item.id && "border-primary ring-1 ring-primary"
                  )}
                >
                  <CardContent className="p-4">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-foreground-muted">{item.blocks.length} blocos</p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        ))}

      {step === 1 &&
        (clients.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum cliente cadastrado"
            description="Cadastre um cliente antes de criar um contrato."
            action={
              <Button asChild size="sm">
                <Link href="/clients">Ir para Clientes</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {clients.map((item) => (
              <button key={item.id} type="button" onClick={() => setClientId(item.id)} className="text-left">
                <Card
                  className={cn(
                    "cursor-pointer transition-colors hover:border-primary",
                    clientId === item.id && "border-primary ring-1 ring-primary"
                  )}
                >
                  <CardContent className="p-4">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-foreground-muted">{item.email}</p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        ))}

      {step === 2 && (
        <ContractFieldsForm
          fields={requiredFields}
          values={fieldValues}
          onChange={(key, value) => setFieldValues((current) => ({ ...current, [key]: value }))}
        />
      )}

      {step === 3 && template && <BlockPreview blocks={template.blocks} fieldValues={fieldValues} />}

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="size-3.5" /> Voltar
        </Button>

        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={() => setStep((current) => current + 1)} disabled={!canAdvance}>
            Continuar <ArrowRight className="size-3.5" />
          </Button>
        ) : (
          <Button type="button" disabled={isPending} onClick={handleCreate}>
            {isPending ? "Salvando..." : "Salvar contrato"}
          </Button>
        )}
      </div>
    </div>
  );
}
