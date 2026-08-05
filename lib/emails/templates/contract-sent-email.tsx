import { Button, Text } from "@react-email/components";
import { EmailLayout } from "./email-layout";

interface ContractSentEmailProps {
  clientName: string;
  templateName: string;
  signUrl: string;
  isReminder?: boolean;
}

export function ContractSentEmail({ clientName, templateName, signUrl, isReminder }: ContractSentEmailProps) {
  return (
    <EmailLayout
      previewText={
        isReminder
          ? `Lembrete: você ainda não assinou ${templateName}`
          : `Você recebeu um contrato para assinar: ${templateName}`
      }
    >
      <Text className="text-sm text-[#111827]">Olá, {clientName},</Text>
      <Text className="text-sm text-[#111827]">
        {isReminder ? (
          <>
            Este é um lembrete: o contrato <strong>{templateName}</strong> ainda está aguardando sua
            assinatura.
          </>
        ) : (
          <>
            Você recebeu o contrato <strong>{templateName}</strong> para revisar e assinar.
          </>
        )}
      </Text>
      <Button
        href={signUrl}
        className="rounded-md bg-[#2563eb] px-5 py-3 text-center text-sm font-medium text-white"
      >
        Revisar e assinar
      </Button>
      <Text className="text-xs text-[#6b7280]">
        Se o botão não funcionar, copie e cole este link no navegador: {signUrl}
      </Text>
    </EmailLayout>
  );
}
