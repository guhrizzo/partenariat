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
import { useDeleteContract } from "@/features/contracts/hooks";

export function DeleteContractButton({ contractId, label }: { contractId: string; label: string }) {
  const [open, setOpen] = React.useState(false);
  const { deleteContract, isPending } = useDeleteContract(() => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label={`Remover ${label}`}>
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover contrato</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover este rascunho? Essa ação não pode ser desfeita.
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
            onClick={() => deleteContract(contractId)}
          >
            {isPending ? "Removendo..." : "Remover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
