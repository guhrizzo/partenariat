import { QrCode } from "lucide-react";

export function QrCodeBlockComponent() {
  return (
    <div className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-foreground-muted">
      <QrCode className="size-6" />
      <span className="text-[10px]">Validação</span>
    </div>
  );
}
