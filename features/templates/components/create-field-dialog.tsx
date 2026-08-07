"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/design-system/components/button";
import { Input } from "@/design-system/components/input";
import { Label } from "@/design-system/components/label";
import { Select } from "@/design-system/components/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/design-system/components/dialog";
import { useToast } from "@/shared/providers/toast-provider";
import { createFieldDefinitionAction } from "@/features/templates/actions";
import {
  createFieldDefinitionSchema,
  type CreateFieldDefinitionInput,
} from "@/schemas/field-definition.schema";
import type { FieldDefinition } from "@/types";

interface CreateFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (field: FieldDefinition) => void;
}

export function CreateFieldDialog({ open, onOpenChange, onCreated }: CreateFieldDialogProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFieldDefinitionInput>({
    resolver: zodResolver(createFieldDefinitionSchema),
    defaultValues: { key: "", label: "", type: "text", required: false, options: null },
  });

  function onSubmit(input: CreateFieldDefinitionInput) {
    startTransition(async () => {
      const result = await createFieldDefinitionAction(input);
      if (!result.success || !result.field) {
        toast({ title: "Erro ao criar campo", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Campo criado com sucesso", variant: "success" });
      onCreated(result.field);
      reset();
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo campo dinâmico</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="field-label">Rótulo</Label>
            <Input id="field-label" {...register("label")} />
            {errors.label && <p className="text-sm text-red-600">{errors.label.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="field-key">Chave (camelCase)</Label>
            <Input id="field-key" placeholder="ex: prazoEntrega" {...register("key")} />
            {errors.key && <p className="text-sm text-red-600">{errors.key.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="field-type">Tipo</Label>
            <Select id="field-type" {...register("type")}>
              <option value="text">Texto</option>
              <option value="textarea">Texto longo</option>
              <option value="number">Número</option>
              <option value="currency">Valor (R$)</option>
              <option value="date">Data</option>
              <option value="email">E-mail</option>
              <option value="phone">Telefone</option>
              <option value="cpf">CPF</option>
              <option value="cnpj">CNPJ</option>
            </Select>
          </div>
          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Criando..." : "Criar campo"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
