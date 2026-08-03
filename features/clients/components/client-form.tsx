"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/design-system/components/button";
import { Input } from "@/design-system/components/input";
import { Label } from "@/design-system/components/label";
import { createClientSchema, type CreateClientInput } from "@/schemas/client.schema";

interface ClientFormProps {
  defaultValues?: CreateClientInput;
  onSubmit: (input: CreateClientInput) => void;
  isPending: boolean;
  submitLabel: string;
}

const EMPTY_VALUES: CreateClientInput = {
  name: "",
  documentType: "cpf",
  document: "",
  email: "",
  phone: null,
  address: null,
};

export function ClientForm({ defaultValues, onSubmit, isPending, submitLabel }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: defaultValues ?? EMPTY_VALUES,
  });

  const documentType = useWatch({ control, name: "documentType" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-[7.5rem_1fr] gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="documentType">Tipo</Label>
          <select
            id="documentType"
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            {...register("documentType")}
          >
            <option value="cpf">CPF</option>
            <option value="cnpj">CNPJ</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="document">{documentType === "cpf" ? "CPF" : "CNPJ"}</Label>
          <Input id="document" {...register("document")} />
          {errors.document && <p className="text-sm text-red-600">{errors.document.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Telefone (opcional)</Label>
        <Input id="phone" {...register("phone")} />
      </div>

      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}
