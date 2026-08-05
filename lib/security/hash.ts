import "server-only";
import { createHash } from "node:crypto";

/** SHA-256 do conteúdo do contrato no momento da assinatura — evidência de integridade. */
export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}
