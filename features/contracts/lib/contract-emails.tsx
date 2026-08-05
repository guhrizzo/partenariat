import "server-only";
import { sendEmail } from "@/lib/emails/send-email";
import { getAppUrl } from "@/lib/emails/resend-client";
import { ContractSentEmail } from "@/lib/emails/templates/contract-sent-email";
import { ContractSignedEmail } from "@/lib/emails/templates/contract-signed-email";
import type { Client, Contract, Template } from "@/types";

function buildSignUrl(token: string): string {
  return `${getAppUrl()}/sign/${token}`;
}

export async function sendContractSentEmail(
  contract: Contract,
  client: Client,
  template: Template,
  adminEmail: string,
  variant: "sent" | "reminder" = "sent"
): Promise<void> {
  const signUrl = buildSignUrl(contract.publicToken);
  await sendEmail({
    to: client.email,
    cc: adminEmail,
    subject:
      variant === "reminder"
        ? `Lembrete: assine o contrato ${template.name}`
        : `Contrato para assinar: ${template.name}`,
    react: (
      <ContractSentEmail
        clientName={client.name}
        templateName={template.name}
        signUrl={signUrl}
        isReminder={variant === "reminder"}
      />
    ),
  });
}

export async function sendContractSignedEmail(
  contract: Contract,
  client: Client,
  template: Template,
  adminEmail: string
): Promise<void> {
  const signedAt = contract.signedAt?.toLocaleString("pt-BR") ?? "";
  await sendEmail({
    to: client.email,
    cc: adminEmail,
    subject: `Contrato assinado: ${template.name}`,
    react: <ContractSignedEmail recipientName={client.name} templateName={template.name} signedAt={signedAt} />,
  });
}
