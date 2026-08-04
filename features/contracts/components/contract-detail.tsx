"use client";

import Link from "next/link";
import { ArrowLeft, Copy, Send, XCircle } from "lucide-react";
import { Badge, type BadgeProps } from "@/design-system/components/badge";
import { Button } from "@/design-system/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/design-system/components/card";
import { BlockPreview } from "@/features/templates/components/block-preview";
import { useToast } from "@/shared/providers/toast-provider";
import { useCancelContract, useSendContract } from "@/features/contracts/hooks";
import type { Client, Contract, Template } from "@/types";

const STATUS_LABEL: Record<Contract["status"], string> = {
  draft: "Rascunho",
  sent: "Enviado",
  viewed: "Visualizado",
  signed: "Assinado",
  cancelled: "Cancelado",
  expired: "Expirado",
};

const STATUS_VARIANT: Record<Contract["status"], NonNullable<BadgeProps["variant"]>> = {
  draft: "default",
  sent: "primary",
  viewed: "warning",
  signed: "success",
  cancelled: "destructive",
  expired: "destructive",
};

interface ContractDetailProps {
  contract: Contract;
  template: Template;
  client: Client;
}

export function ContractDetail({ contract, template, client }: ContractDetailProps) {
  const { toast } = useToast();
  const { sendContract, isPending: isSending } = useSendContract();
  const { cancelContract, isPending: isCancelling } = useCancelContract();

  const signPath = `/sign/${contract.publicToken}`;

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}${signPath}`);
    toast({ title: "Link copiado", variant: "success" });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/contracts" aria-label="Voltar para contratos">
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{template.name}</h1>
            <p className="text-sm text-foreground-muted">{client.name}</p>
          </div>
          <Badge variant={STATUS_VARIANT[contract.status]}>{STATUS_LABEL[contract.status]}</Badge>
        </div>

        <div className="flex items-center gap-2">
          {contract.status === "draft" && (
            <Button type="button" size="sm" disabled={isSending} onClick={() => sendContract(contract.id)}>
              <Send className="size-3.5" />
              {isSending ? "Enviando..." : "Enviar"}
            </Button>
          )}
          {(contract.status === "draft" || contract.status === "sent") && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isCancelling}
              onClick={() => cancelContract(contract.id)}
            >
              <XCircle className="size-3.5" /> Cancelar
            </Button>
          )}
        </div>
      </div>

      {contract.status !== "draft" && contract.status !== "cancelled" && (
        <Card>
          <CardHeader>
            <CardTitle>Link de assinatura</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-md bg-background-subtle px-3 py-2 text-xs text-foreground-muted">
              {signPath}
            </code>
            <Button type="button" variant="outline" size="icon" onClick={copyLink} aria-label="Copiar link">
              <Copy className="size-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      <BlockPreview blocks={template.blocks} fieldValues={contract.fieldValues} />
    </div>
  );
}
