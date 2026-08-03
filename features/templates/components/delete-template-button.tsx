"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/design-system/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/design-system/components/dialog";
import { useDeleteTemplate } from "@/features/templates/hooks";
import type { Template } from "@/types";

export function DeleteTemplateButton({ template }: { template: Template }) {
  const [open, setOpen] = React.useState(false);
  const { deleteTemplate, isPending } = useDeleteTemplate(() => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label={`Remover ${template.name}`}>
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover modelo</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover {template.name}? Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => deleteTemplate(template.id)}
          >
            {isPending ? "Removendo..." : "Remover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
