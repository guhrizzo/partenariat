import { Text } from "@react-email/components";
import { EmailLayout } from "./email-layout";

interface ContractSignedEmailProps {
  recipientName: string;
  templateName: string;
  signedAt: string;
}

export function ContractSignedEmail({ recipientName, templateName, signedAt }: ContractSignedEmailProps) {
  return (
    <EmailLayout previewText={`Contrato assinado: ${templateName}`}>
      <Text className="text-sm text-[#111827]">Olá, {recipientName},</Text>
      <Text className="text-sm text-[#111827]">
        O contrato <strong>{templateName}</strong> foi assinado em {signedAt}.
      </Text>
      <Text className="text-sm text-[#111827]">
        O PDF assinado, com todas as evidências da assinatura, já está disponível no PARTENARIAT.
      </Text>
    </EmailLayout>
  );
}
