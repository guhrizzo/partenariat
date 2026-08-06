import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";

// Injetado pelo build do Serwist (via withSerwistInit) com a lista de assets
// estáticos do build (JS/CSS/manifest/ícones) — precache do "app shell".
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  // `defaultCache` é a lista de estratégias recomendada pelo próprio pacote
  // para apps Next.js: network-first para documentos/RSC (então uma página
  // de contrato já aberta antes fica disponível se a rede cair de novo) e
  // cache-first para assets versionados (_next/static, fontes, imagens).
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
