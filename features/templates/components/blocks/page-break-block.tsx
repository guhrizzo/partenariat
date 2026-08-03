import { FileText } from "lucide-react";

export function PageBreakBlockComponent() {
  return (
    <div className="flex items-center gap-2 border-t border-dashed border-border py-2 text-xs text-foreground-muted">
      <FileText className="size-3.5" />
      Quebra de página
    </div>
  );
}
