import "server-only";
import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = ["b", "strong", "i", "em", "u", "s", "a", "br", "p", "span"];
const ALLOWED_ATTR = ["href", "target", "rel"];

/** Sanitiza HTML de blocos de texto rico antes de persistir (bloco `paragraph` do editor). */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS, ALLOWED_ATTR });
}
