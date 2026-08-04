import "server-only";
import { randomBytes } from "node:crypto";

/** Token de alta entropia (256 bits por padrão) — nunca usar IDs sequenciais em links públicos. */
export function generateSecureToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}
