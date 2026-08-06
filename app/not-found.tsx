import type { Metadata } from "next";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/design-system/components/button";
import { EmptyState } from "@/design-system/components/empty-state";

export const metadata: Metadata = {
  title: "Página não encontrada — PARTENARIAT",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-subtle px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
        <EmptyState
          icon={FileQuestion}
          title="Página não encontrada"
          description="O link pode estar incorreto ou o conteúdo pode ter sido removido."
          action={
            <Button asChild size="sm">
              <Link href="/">Voltar ao início</Link>
            </Button>
          }
        />
      </div>
    </div>
  );
}
