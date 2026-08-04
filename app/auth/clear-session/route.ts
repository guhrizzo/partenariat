import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

/**
 * `proxy.ts` só confere se o cookie de sessão existe (checagem otimista,
 * rápida); a verificação criptográfica de verdade acontece no DAL, dentro
 * do layout protegido. Se o cookie existir mas for inválido (expirado, de
 * outro projeto Firebase, revogado etc.), o DAL não consegue limpá-lo — só
 * Server Actions e Route Handlers podem mutar cookies — e sem isso o proxy
 * manda de volta pro dashboard, formando um loop. Esta rota existe só para
 * quebrar esse loop: limpa o cookie inválido e manda para o login de vez.
 */
export async function GET(request: Request) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/login", request.url));
}
