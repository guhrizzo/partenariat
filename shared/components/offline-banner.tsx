"use client";

import { useOffline } from "next/offline";
import { WifiOff } from "lucide-react";

/**
 * Banner fixo exibido em toda a área logada enquanto o app está offline.
 * `useOffline()` só existe/funciona com `experimental.useOffline` ativo em
 * next.config.ts — sem ele, o hook sempre retorna `false`.
 */
export function OfflineBanner() {
  const isOffline = useOffline();

  if (!isOffline) {
    return null;
  }

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-xs font-medium text-white"
    >
      <WifiOff className="size-3.5" />
      Você está offline. O que já foi carregado continua disponível; ações pendentes serão concluídas quando a conexão voltar.
    </div>
  );
}
