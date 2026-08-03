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
import { useDeleteClient } from "@/features/clients/hooks";
import type { Client } from "@/types";

export function DeleteClientButton({ client }: { client: Client }) {
  const [open, setOpen] = React.useState(false);
  const { deleteClient, isPending } = useDeleteClient(() => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label={`Remover ${client.name}`}>
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover cliente</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover {client.name}? Essa ação não pode ser desfeita.
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
            onClick={() => deleteClient(client.id)}
          >
            {isPending ? "Removendo..." : "Remover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
