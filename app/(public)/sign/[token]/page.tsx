import type { Metadata } from "next";
import { headers } from "next/headers";
import { CheckCircle2, Clock, XCircle, type LucideIcon } from "lucide-react";
import { extractIp } from "@/lib/security/ip";
import { checkRateLimit } from "@/lib/security/rate-limit";
import {
  getContractByToken,
  markContractViewed,
} from "@/features/contracts/repositories/contract-repository";
import { getTemplate } from "@/features/templates/repositories/template-repository";
import { getClient } from "@/features/clients/repositories/client-repository";
import { logContractEvent } from "@/features/contracts/repositories/audit-log-repository";
import { BlockPreview } from "@/features/templates/components/block-preview";
import { ProtectedDocument, SignContractForm } from "@/features/contracts/components/public";
import { listPaymentsByContract } from "@/features/payments/repositories/payment-repository";
import { PayNowButton } from "@/features/payments/components/pay-now-button";

export const metadata: Metadata = {
  title: "Assinatura de contrato — PARTENARIAT",
};

interface SignPageProps {
  params: Promise<{ token: string }>;
}

function StatusMessage({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-10 text-center">
      <Icon className="size-10 text-foreground-muted" />
      <p className="text-lg font-medium text-foreground">{title}</p>
      <p className="text-sm text-foreground-muted">{description}</p>
    </div>
  );
}

export default async function SignPage({ params }: SignPageProps) {
  const { token } = await params;

  // Limita por IP mesmo antes de olhar o token: essa página é o alvo óbvio
  // pra quem quiser tentar enumerar tokens válidos por força bruta.
  const ip = extractIp(await headers());
  const viewLimit = await checkRateLimit(`sign-view:ip:${ip}`, 60, 60);
  if (!viewLimit.allowed) {
    return (
      <StatusMessage
        icon={Clock}
        title="Muitas tentativas"
        description="Você fez muitas requisições em pouco tempo. Aguarde um momento e tente novamente."
      />
    );
  }

  const contract = await getContractByToken(token);

  if (!contract) {
    return (
      <StatusMessage
        icon={XCircle}
        title="Link inválido"
        description="Este link de assinatura não existe ou não é mais válido."
      />
    );
  }

  if (contract.status === "expired") {
    return (
      <StatusMessage
        icon={Clock}
        title="Link expirado"
        description="Este link de assinatura expirou. Entre em contato com quem enviou o contrato."
      />
    );
  }

  if (contract.status === "cancelled") {
    return (
      <StatusMessage
        icon={XCircle}
        title="Contrato cancelado"
        description="Este contrato foi cancelado e não está mais disponível para assinatura."
      />
    );
  }

  const [template, client] = await Promise.all([
    getTemplate(contract.organizationId, contract.templateId),
    getClient(contract.organizationId, contract.clientId),
  ]);

  if (!template || !client) {
    return (
      <StatusMessage
        icon={XCircle}
        title="Contrato indisponível"
        description="Não foi possível carregar este contrato."
      />
    );
  }

  if (contract.status === "sent") {
    await markContractViewed(contract.id);
    await logContractEvent(contract.id, "opened", null, {});
  }

  if (contract.status === "signed") {
    const payments = await listPaymentsByContract(contract.id);
    const isPaid = payments.some((payment) => payment.status === "paid");
    const showPayButton = contract.paymentAmount && contract.paymentProvider && !isPaid;

    return (
      <div className="flex flex-col gap-6">
        <StatusMessage
          icon={CheckCircle2}
          title="Contrato já assinado"
          description={
            contract.signedAt ? `Assinado em ${contract.signedAt.toLocaleDateString("pt-BR")}.` : ""
          }
        />
        {contract.validationCode && (
          <p className="text-center text-sm text-foreground-muted">
            Código de validação: <span className="font-mono font-medium">{contract.validationCode}</span>{" "}
            — valide em <span className="font-mono">/validate/{contract.validationCode}</span>
          </p>
        )}
        {isPaid && (
          <p className="text-center text-sm font-medium text-emerald-600">Pagamento confirmado.</p>
        )}
        {showPayButton && <PayNowButton token={token} amount={contract.paymentAmount as number} />}
        <ProtectedDocument>
          <BlockPreview blocks={template.blocks} fieldValues={contract.fieldValues} />
        </ProtectedDocument>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProtectedDocument>
        <BlockPreview blocks={template.blocks} fieldValues={contract.fieldValues} />
      </ProtectedDocument>
      <SignContractForm token={token} defaultName={client.name} />
    </div>
  );
}
