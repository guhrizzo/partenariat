"use client";

import { useEffect } from "react";

/**
 * Registra o service worker gerado em build (`public/sw.js`, ver
 * serwist.config.mjs). O modo "configurador" do Serwist não injeta um
 * script de registro automático como o plugin webpack clássico faria
 * (esse plugin não roda no Turbopack, padrão do Next.js 16) — então o
 * registro é feito manualmente aqui.
 *
 * Só roda em produção: `public/sw.js` só existe depois de `npm run build`
 * (etapa `serwist build`), e registrar um worker inexistente/desatualizado
 * durante `next dev` atrapalharia o hot reload.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
      console.error("Falha ao registrar o service worker:", error);
    });
  }, []);

  return null;
}
