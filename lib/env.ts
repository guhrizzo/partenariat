/** URL pública do app — usada em Server Actions/Route Handlers (sem acesso a window.location) para montar links absolutos. */
export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
