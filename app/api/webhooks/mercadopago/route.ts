import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";
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
 * Valida a assinatura HMAC-SHA256 enviada pelo Mercado Pago nos webhooks v2.
 *
 * Se MERCADOPAGO_WEBHOOK_SECRET estiver configurado, exigimos o header
 * `x-signature` com `v1=` cujo HMAC bata. Se não estiver configurado, aceitamos
 * sem validar (modo dev) — a MP já confere a URL de destino, então é defesa em
 * profundidade, não autorização. Como sempre respondemos 200 independente do
 * erro, um signature inválida apenas é descartada em silêncio.
 */
function verifyMercadoPagoSignature(
  headers: Headers,
  dataId: string,
  urlSearchParams: URLSearchParams
): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true;

  const signatureHeader = headers.get("x-signature");
  if (!signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((kv) => kv.split("=").map((s) => s.trim()))
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const requestId = headers.get("x-request-id") ?? "";

  // Versão 1 do template de assinatura da MP (data.id vinda no body).
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(v1, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
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

  if (!verifyMercadoPagoSignature(request.headers, String(paymentId), url.searchParams)) {
    console.warn("Webhook do Mercado Pago rejeitado por assinatura inválida", { paymentId });
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
    console.error("Pagamento do Mercado Pago sem external_reference ou status", paymentId, data);
    return NextResponse.json({ received: true });
  }

  const payment = await getPayment(data.external_reference);
  if (!payment) {
    console.error(
      "external_reference do Mercado Pago não corresponde a nenhum Payment local",
      data.external_reference,
      paymentId
    );
    return NextResponse.json({ received: true });
  }

  await updatePaymentStatus(payment.id, mapMercadoPagoStatus(data.status));

  revalidatePath(`/contracts/${payment.contractId}`);
  revalidatePath("/contracts");

  return NextResponse.json({ received: true });
}
