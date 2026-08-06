import "server-only";
import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/constants/firestore";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Limitador de janela fixa, persistido no Firestore — sem Redis configurado
 * neste projeto, é a opção mais simples que ainda funciona de verdade na
 * Vercel: sobrevive a cold start e é compartilhado entre instâncias
 * serverless (um `Map` em memória não seria, cada instância teria o seu).
 *
 * `key` deve identificar de forma única o que está sendo limitado (rota +
 * IP, ou rota + token). Cada janela cria um novo documento; docs de janelas
 * passadas não são limpos automaticamente — se o volume começar a incomodar,
 * configure uma TTL policy no Firestore sobre o campo `expiresAt`.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const windowMs = windowSeconds * 1000;
  const windowIndex = Math.floor(Date.now() / windowMs);
  const windowStart = windowIndex * windowMs;
  const retryAfterSeconds = Math.ceil((windowStart + windowMs - Date.now()) / 1000);

  const ref = adminDb.collection(COLLECTIONS.rateLimits).doc(`${key}:${windowIndex}`);

  const count = await adminDb.runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    const current = (snapshot.data()?.count as number | undefined) ?? 0;
    const next = current + 1;
    tx.set(ref, { count: next, expiresAt: new Date(windowStart + windowMs) }, { merge: true });
    return next;
  });

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds,
  };
}
