"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BellRing, Copy, Download, Send, Trash2, XCircle } from "lucide-react";
import { Badge, type BadgeProps } from "@/design-system/components/badge";
import { Button } from "@/design-system/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/design-system/components/card";
import { BlockPreview } from "@/features/templates/components/block-preview";
import { useToast } from "@/shared/providers/toast-provider";
import { useCancelContract, useRemindContract, useSendContract } from "@/features/contracts/hooks";
import { DeleteContractButton } from "@/features/contracts/components/delete-contract-button";
import type { Client, Contract, Payment, Template } from "@/types";

const PAYMENT_STATUS_LABEL: Record<Payment["status"], string> = {
  pending: "Pendente",
  paid: "Pago",
  failed: "Falhou",
  refunded: "Reembolsado",
};

const PAYMENT_STATUS_VARIANT: Record<Payment["status"], NonNullable<BadgeProps["variant"]>> = {
  pending: "warning",
  paid: "success",
  failed: "destructive",
  refunded: "default",
};

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
  pdfDownloadUrl: string | null;
  latestPayment: Payment | null;
}

export function ContractDetail({
  contract,
  template,
  client,
  pdfDownloadUrl,
  latestPayment,
}: ContractDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { sendContract, isPending: isSending } = useSendContract();
  const { cancelContract, isPending: isCancelling } = useCancelContract();
  const { remindContract, isPending: isReminding } = useRemindContract();

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
          {(contract.status === "sent" || contract.status === "viewed") && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isReminding}
              onClick={() => remindContract(contract.id)}
            >
              <BellRing className="size-3.5" />
              {isReminding ? "Enviando..." : "Enviar lembrete"}
            </Button>
          )}
          {(contract.status === "draft" || contract.status === "sent" || contract.status === "viewed") && (
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
          <DeleteContractButton
            contractId={contract.id}
            label={template.name}
            triggerVariant="outline"
            triggerSize="sm"
            onDeleted={() => router.push("/contracts")}
          >
            <Trash2 className="size-3.5" /> Excluir
          </DeleteContractButton>
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

      {contract.status === "signed" && (
        <Card>
          <CardHeader>
            <CardTitle>Documento assinado</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-foreground">
                Código de validação: <span className="font-mono">{contract.validationCode ?? "—"}</span>
              </p>
              <p className="text-xs text-foreground-muted">
                Hash: {contract.documentHash ? `${contract.documentHash.slice(0, 24)}...` : "—"}
              </p>
            </div>
            {pdfDownloadUrl ? (
              <Button asChild variant="outline" size="sm">
                <a href={pdfDownloadUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="size-3.5" /> Baixar PDF
                </a>
              </Button>
            ) : (
              <span className="text-xs text-foreground-muted">PDF ainda não disponível</span>
            )}
          </CardContent>
        </Card>
      )}

      {contract.paymentAmount && (
        <Card>
          <CardHeader>
            <CardTitle>Cobrança</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-foreground">
                {contract.paymentAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                {" via "}
                {contract.paymentProvider === "mercadopago" ? "Mercado Pago" : contract.paymentProvider}
              </p>
              <p className="text-xs text-foreground-muted">
                {latestPayment
                  ? "Cobrança iniciada pelo cliente após a assinatura."
                  : "Aguardando o cliente assinar e iniciar o pagamento."}
              </p>
            </div>
            {latestPayment && (
              <Badge variant={PAYMENT_STATUS_VARIANT[latestPayment.status]}>
                {PAYMENT_STATUS_LABEL[latestPayment.status]}
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      <BlockPreview blocks={template.blocks} fieldValues={contract.fieldValues} />
    </div>
  );
}
