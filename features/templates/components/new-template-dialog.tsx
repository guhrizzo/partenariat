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
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="template-name">Nome</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="ex: Contrato de Prestação de Serviços"
            />
          </div>
          <Button
            type="button"
            disabled={isPending || name.trim().length < 2}
            onClick={() => createTemplate(name)}
          >
            {isPending ? "Criando..." : "Criar e editar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
