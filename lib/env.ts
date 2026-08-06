/**
 * URL pública do app — usada em Server Actions/Route Handlers (sem acesso a
 * window.location) para montar links absolutos (e-mails, checkout do
 * Mercado Pago). Falha alto e com mensagem clara em vez de cair
 * silenciosamente para `localhost` em produção: um `NEXT_PUBLIC_APP_URL`
 * ausente/errado só na Vercel (não lê o `.env.local`) já gerou o erro
 * confuso "back_url.success must be defined" direto na API do Mercado Pago.
 */
export function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL;

  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_APP_URL não está definida. Configure essa variável nas Environment Variables do ambiente de produção (ex.: Vercel) — sem ela, links de e-mail e o checkout do Mercado Pago apontam para localhost e falham."
      );
    }
    return "http://localhost:3000";
  }

  if (!/^https?:\/\//.test(url)) {
    throw new Error(
      `NEXT_PUBLIC_APP_URL inválida: "${url}". Deve ser uma URL absoluta com protocolo, ex.: https://seudominio.com.`
    );
  }

  return url.replace(/\/+$/, "");
}
