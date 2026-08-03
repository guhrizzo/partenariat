import { cn } from "@/shared/utils/cn";

/**
 * Casca visual do "papel" — usada pelo editor (Fase 4) e reaproveitada pelo
 * preview de contrato (Fase 5+). O container pai precisa ter a classe
 * `.light` (ver globals.css) para que os tokens de tema fiquem fixos no
 * claro aqui dentro, independente do tema do app: um documento final é
 * sempre papel branco, em qualquer modo.
 */
export function DocumentPage({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[816px] flex-col gap-3 rounded-lg border border-border bg-card p-12 text-foreground shadow-sm",
        className
      )}
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {children}
    </div>
  );
}
