import "server-only";
import type { ReactElement } from "react";
import { EMAIL_FROM, getResendClient } from "./resend-client";

interface SendEmailInput {
  to: string;
  cc?: string;
  subject: string;
  react: ReactElement;
}

/**
 * Nunca lança para quem chama: falha de e-mail não pode derrubar a ação de
 * negócio que a disparou (enviar contrato, assinar contrato). Só loga.
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  try {
    const client = getResendClient();
    const result = await client.emails.send({
      from: EMAIL_FROM,
      to: input.to,
      cc: input.cc,
      subject: input.subject,
      react: input.react,
    });
    if (result.error) {
      console.error("Falha ao enviar e-mail:", result.error);
    }
  } catch (error) {
    console.error("Falha ao enviar e-mail:", error);
  }
}
