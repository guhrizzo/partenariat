import "server-only";
import { Resend } from "resend";

let client: Resend | null = null;

/** Init preguiçosa: importar este módulo não deve quebrar o app antes de RESEND_API_KEY existir. */
export function getResendClient(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Resend não configurado: defina RESEND_API_KEY para enviar e-mails.");
    }
    client = new Resend(apiKey);
  }
  return client;
}

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL ?? "PARTENARIAT <onboarding@resend.dev>";

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
