/**
 * Isolado em seu próprio módulo (sem depender do Admin SDK) para que
 * `proxy.ts` possa importar só o nome do cookie, sem puxar `firebase-admin`
 * para o runtime do Proxy.
 */
export const SESSION_COOKIE_NAME = "session";
