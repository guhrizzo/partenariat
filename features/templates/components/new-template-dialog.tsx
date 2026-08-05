"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/design-system/components/button";
import { Input } from "@/design-system/components/input";
import { Label } from "@/design-system/components/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/design-system/components/dialog";
import { useCreateTemplate } from "@/features/templates/hooks";

export function NewTemplateDialog() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const { createTemplate, isPending } = useCreateTemplate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending || name.trim().length < 2) return;
    createTemplate(name);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus />
          Novo modelo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo modelo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="template-name">Nome</Label>
            <Input
              id="template-name"
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="ex: Contrato de Prestação de Serviços"
            />
          </div>
          <Button type="submit" disabled={isPending || name.trim().length < 2}>
            {isPending ? "Criando..." : "Criar e editar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
