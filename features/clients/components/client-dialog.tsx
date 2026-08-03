"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/design-system/components/dialog";
import { ClientForm } from "@/features/clients/components/client-form";
import { useCreateClient, useUpdateClient } from "@/features/clients/hooks";
import type { CreateClientInput } from "@/schemas/client.schema";
import type { Client } from "@/types";

interface ClientDialogProps {
  client?: Client;
  trigger: React.ReactNode;
}

function toFormValues(client: Client): CreateClientInput {
  return {
    name: client.name,
    documentType: client.documentType,
    document: client.document,
    email: client.email,
    phone: client.phone,
    address: client.address,
  };
}

export function ClientDialog({ client, trigger }: ClientDialogProps) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  const { createClient, isPending: isCreating } = useCreateClient(close);
  const { updateClient, isPending: isUpdating } = useUpdateClient(close);

  function handleSubmit(input: CreateClientInput) {
    if (client) {
      updateClient(client.id, input);
    } else {
      createClient(input);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{client ? "Editar cliente" : "Novo cliente"}</DialogTitle>
        </DialogHeader>
        <ClientForm
          defaultValues={client ? toFormValues(client) : undefined}
          onSubmit={handleSubmit}
          isPending={client ? isUpdating : isCreating}
          submitLabel={client ? "Salvar alterações" : "Criar cliente"}
        />
      </DialogContent>
    </Dialog>
  );
}
