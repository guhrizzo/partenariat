import "server-only";
import { randomBytes } from "node:crypto";

/** Token de alta entropia (256 bits por padrão) — nunca usar IDs sequenciais em links públicos. */
export function generateSecureToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

// Sem 0/O, 1/I/L — evita ambiguidade quando o código é lido ou digitado manualmente.
const VALIDATION_CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Código curto, legível por humanos, para a página pública /validate/[codigo]. Não é secreto por si só — é público no PDF. */
export function generateValidationCode(length = 10): string {
  const bytes = randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += VALIDATION_CODE_ALPHABET[bytes[i] % VALIDATION_CODE_ALPHABET.length];
  }
  return code;
}
