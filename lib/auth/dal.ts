import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { adminAuth } from "@/firebase/admin";
import type { MemberRole } from "@/types";
import { getSessionCookie } from "./session";

export interface SessionContext {
  userId: string;
  email: string;
  name: string | null;
  organizationId: string;
  role: MemberRole;
}

/**
 * Decodifica e verifica criptograficamente o cookie de sessão. As claims
 * `orgId`/`role` já vêm embutidas no cookie (setadas no registro via
 * `setCustomUserClaims`), então nenhuma leitura ao Firestore é necessária
 * neste caminho quente. Memoizado por request via `cache()`.
 */
export const getOptionalSession = cache(async (): Promise<SessionContext | null> => {
  const sessionCookie = await getSessionCookie();
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const organizationId = decoded.orgId as string | undefined;
    const role = decoded.role as MemberRole | undefined;

    if (!organizationId || !role) return null;

    return {
      userId: decoded.uid,
      email: decoded.email ?? "",
      name: (decoded.name as string | undefined) ?? null,
      organizationId,
      role,
    };
  } catch {
    return null;
  }
});

/**
 * Use em Server Components/layouts protegidos: redireciona para /login se
 * não houver sessão válida. Quando existe um cookie mas ele é inválido,
 * redireciona para a rota que o limpa antes de ir para /login — do
 * contrário o `proxy.ts` (que só checa a presença do cookie) manda de
 * volta para a rota protegida e forma um loop de redirecionamento.
 */
export async function verifySession(): Promise<SessionContext> {
  const session = await getOptionalSession();
  if (!session) {
    const staleCookie = await getSessionCookie();
    redirect(staleCookie ? "/auth/clear-session" : "/login");
  }
  return session;
}
