import { NextResponse } from "next/server";
import { getPayment, updatePaymentStatus } from "@/features/payments/repositories/payment-repository";
import { extractIp } from "@/lib/security/ip";
import { checkRateLimit } from "@/lib/security/rate-limit";
import type { PaymentStatus } from "@/types";

function mapMercadoPagoStatus(status: string): PaymentStatus {
  switch (status) {
    case "approved":
      return "paid";
    case "refunded":
    case "charged_back":
      return "refunded";
    case "rejected":
    case "cancelled":
      return "failed";
    default:
      return "pending";
  }
}

/**
 * Sempre responde 200 (mesmo em erro interno) para o Mercado Pago não
 * ficar reenviando a notificação indefinidamente. Nunca confia no corpo do
 * webhook para o status — sempre busca o pagamento de volta na API da MP
 * com nosso próprio access token antes de gravar qualquer coisa.
 */
export async function POST(request: Request) {
  // Sempre responde 200 mesmo aqui: um 429 faria o Mercado Pago reenviar a
  // notificação sem parar (mesmo comportamento de erro interno, ver
  // comentário abaixo) — só descartamos a requisição em excesso.
  const ip = extractIp(request.headers);
  const ipLimit = await checkRateLimit(`mp-webhook:ip:${ip}`, 60, 60);
  if (!ipLimit.allowed) {
    return NextResponse.json({ received: true });
  }

  const url = new URL(request.url);
  const queryTopic = url.searchParams.get("topic") ?? url.searchParams.get("type");
  const queryId = url.searchParams.get("id") ?? url.searchParams.get("data.id");

  let body: { type?: string; data?: { id?: string } } = {};
  try {
    body = await request.json();
  } catch {
    // Notificações IPN antigas só mandam query string, sem corpo JSON.
  }

  const topic = queryTopic ?? body.type;
  const paymentId = queryId ?? body.data?.id;

  if (topic !== "payment" || !paymentId) {
    return NextResponse.json({ received: true });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("Webhook do Mercado Pago recebido, mas MERCADOPAGO_ACCESS_TOKEN não está configurado.");
    return NextResponse.json({ received: true });
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    console.error("Falha ao buscar pagamento no Mercado Pago", paymentId, response.status);
    return NextResponse.json({ received: true });
  }

  const data = (await response.json()) as { external_reference?: string; status?: string };
  if (!data.external_reference || !data.status) {
    return NextResponse.json({ received: true });
  }

  const payment = await getPayment(data.external_reference);
  if (!payment) {
    return NextResponse.json({ received: true });
  }

  await updatePaymentStatus(payment.id, mapMercadoPagoStatus(data.status));

  return NextResponse.json({ received: true });
}
