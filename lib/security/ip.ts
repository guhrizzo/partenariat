import "server-only";

/**
 * Extrai o IP do cliente a partir dos headers do request. Nunca confiamos em
 * nada que o próprio cliente possa mandar no corpo/query — só nos headers de
 * proxy que a infraestrutura (Vercel) injeta. Usado tanto como evidência
 * forense (assinatura) quanto como chave de rate limit nas rotas públicas.
 */
export function extractIp(headerList: Headers): string {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headerList.get("x-real-ip") ?? "unknown";
}
