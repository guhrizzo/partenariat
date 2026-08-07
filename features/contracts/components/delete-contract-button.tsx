"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button, type ButtonProps } from "@/design-system/components/button";
import { Input } from "@/design-system/components/input";
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

interface DeleteContractButtonProps {
  contractId: string;
  label: string;
  onDeleted?: () => void;
  /** Personaliza o botão que abre o diálogo. Padrão: ícone de lixeira. */
  triggerVariant?: ButtonProps["variant"];
  triggerSize?: ButtonProps["size"];
  children?: React.ReactNode;
}

export function DeleteContractButton({
  contractId,
  label,
  onDeleted,
  triggerVariant = "ghost",
  triggerSize = "icon",
  children,
}: DeleteContractButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState("");
  const { deleteContract, isPending } = useDeleteContract(() => {
    setOpen(false);
    onDeleted?.();
  });

  const isConfirmed = confirmation === label;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setConfirmation("");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant={triggerVariant} size={triggerSize} aria-label={`Remover ${label}`}>
          {children ?? <Trash2 />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover contrato</DialogTitle>
          <DialogDescription>
            Essa ação não pode ser desfeita. Isso vai remover permanentemente o contrato e todos os
            dados associados a ele.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <p className="text-[13px] text-foreground-muted">
            Para confirmar, digite <span className="font-semibold text-foreground">{label}</span>{" "}
            abaixo:
          </p>
          <Input
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder={label}
            autoComplete="off"
            autoFocus
            aria-label={`Digite "${label}" para confirmar`}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={!isConfirmed || isPending}
            onClick={() => deleteContract(contractId)}
          >
            {isPending ? "Removendo..." : "Remover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
