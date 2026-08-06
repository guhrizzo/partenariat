import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// CSP sem nonce (ver node_modules/next/dist/docs/.../guides/content-security-policy.md,
// seção "Without Nonces") — a variante com nonce exigiria forçar renderização
// dinâmica em todas as rotas via proxy.ts, que já é sensível (histórico do
// bug do loop de redirect na sessão). 'unsafe-inline' cobre o script de
// tema inline (app/layout.tsx) e os estilos inline que o Radix UI injeta
// para posicionamento (Dialog/DropdownMenu/Toast).
//
// connect-src e img-src incluem os hosts do Firebase Auth/Storage porque o
// SDK client-side fala com eles diretamente do navegador (login/registro via
// firebase/auth, upload de imagem em blocos de template via firebase/storage)
// — não passam pelo servidor Next.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://firebasestorage.googleapis.com;
  font-src 'self';
  connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebasestorage.googleapis.com;
  worker-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

// `firebase-admin` precisa de `require` nativo: ele depende de `jwks-rsa`
// (CJS), que faz `require("jose")` — mas `jose` é ESM puro, e o Turbopack
// do Next 16 não consegue resolver isso via empacotamento, gerando o
// `ERR_REQUIRE_ESM` em runtime na Vercel. Mantemos o pacote fora do bundle
// para que o Node faça o `require` direto em produção.
// Incluímos `jose` e `jwks-rsa` explicitamente: o `serverExternalPackages`
// do Next só externaliza o pacote listado, não as suas dependências
// transitivas. Sem isso, o Turbopack ainda embute `jwks-rsa` (e portanto o
// `require("jose")` que ele faz) dentro do bundle server-side.
// https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages
const serverExternalPackages = ["firebase-admin", "jwks-rsa", "jose"];

const nextConfig: NextConfig = {
  experimental: {
    // Retenta navegações/Server Actions automaticamente quando a conexão
    // cai e volta; expõe o hook `useOffline` de "next/offline". Não requer
    // Cache Components (decisão já tomada de não habilitar) — um
    // `loading.tsx` por segmento dá a mesma fronteira de prefetch.
    // https://nextjs.org/docs/app/api-reference/config/next-config-js/useOffline
    useOffline: true,
  },
  serverExternalPackages,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
