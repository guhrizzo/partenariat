"use client";

import { useEffect } from "react";
import { Button } from "@/design-system/components/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Boundary de erro pra toda a árvore de rotas (mantém o layout raiz — header,
 * tema, etc. — ao contrário de `global-error.tsx`, que só existia até agora
 * e substitui a página inteira). Sem este arquivo, qualquer exceção não
 * tratada em qualquer rota caía direto na tela genérica do `global-error`.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-lg font-semibold text-foreground">Algo deu errado</h1>
      <p className="max-w-sm text-sm text-foreground-muted">
        Ocorreu um erro inesperado ao carregar esta página. Você pode tentar novamente.
      </p>
      <Button type="button" size="sm" onClick={() => reset()}>
        Tentar novamente
      </Button>
    </div>
  );
}
