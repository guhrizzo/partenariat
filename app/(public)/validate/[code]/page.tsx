import type { Metadata } from "next";
import { headers } from "next/headers";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { getContractByValidationCode } from "@/features/contracts/repositories/contract-repository";
import { getTemplate } from "@/features/templates/repositories/template-repository";
import { listSignatures } from "@/features/contracts/repositories/signature-repository";
import { getSignedDownloadUrl } from "@/lib/storage/signed-url";
import { extractIp } from "@/lib/security/ip";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const metadata: Metadata = {
  title: "Validar contrato — PARTENARIAT",
};

interface ValidatePageProps {
  params: Promise<{ code: string }>;
}

export default async function ValidatePage({ params }: ValidatePageProps) {
  const { code } = await params;

  // Código de validação é curto e público por natureza (impresso no PDF) —
  // sem limite por IP aqui, seria trivial varrer o espaço de códigos.
  const ip = extractIp(await headers());
  const viewLimit = await checkRateLimit(`validate-view:ip:${ip}`, 60, 60);
  if (!viewLimit.allowed) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-10 text-center">
        <Clock className="size-10 text-foreground-muted" />
        <p className="text-lg font-medium text-foreground">Muitas tentativas</p>
        <p className="text-sm text-foreground-muted">
          Você fez muitas requisições em pouco tempo. Aguarde um momento e tente novamente.
        </p>
      </div>
    );
  }

  const contract = await getContractByValidationCode(code.toUpperCase());

  if (!contract || contract.status !== "signed") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-10 text-center">
        <XCircle className="size-10 text-foreground-muted" />
        <p className="text-lg font-medium text-foreground">Código inválido</p>
        <p className="text-sm text-foreground-muted">
          Não encontramos nenhum contrato assinado com este código de validação.
        </p>
      </div>
    );
  }

  const [template, signatures] = await Promise.all([
    getTemplate(contract.organizationId, contract.templateId),
    listSignatures(contract.id),
  ]);

  const pdfUrl = contract.pdfUrl ? await getSignedDownloadUrl(contract.pdfUrl) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="size-10 text-emerald-600" />
        <p className="text-lg font-medium text-foreground">Contrato autêntico</p>
        <p className="text-sm text-foreground-muted">
          Este documento foi assinado digitalmente e sua integridade foi verificada.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-foreground-muted">Modelo</dt>
            <dd className="text-sm text-foreground">{template?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-foreground-muted">Assinado em</dt>
            <dd className="text-sm text-foreground">
              {contract.signedAt ? contract.signedAt.toLocaleString("pt-BR") : "—"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase text-foreground-muted">Hash do documento</dt>
            <dd className="break-all font-mono text-xs text-foreground-muted">{contract.documentHash}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase text-foreground-muted">Assinantes</dt>
            <dd className="flex flex-col gap-1 text-sm text-foreground">
              {signatures.map((signature) => (
                <span key={signature.id}>
                  {signature.signerName} — {signature.signedAt.toLocaleString("pt-BR")}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            Baixar PDF do contrato
          </a>
        )}
      </div>
    </div>
  );
}
