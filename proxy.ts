import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/constants/auth";

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register"];

/**
 * Checagem otimista (só presença do cookie, sem verificar assinatura) para
 * evitar flash de conteúdo protegido e redirecionar cedo. A validação real
 * acontece no DAL (`lib/auth/dal.ts`), chamado nos layouts protegidos.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|ico|webp)$).*)"],
};
