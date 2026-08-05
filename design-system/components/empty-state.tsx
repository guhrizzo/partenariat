import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border p-8 text-center",
        className
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-sm bg-panel text-foreground-muted">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[13px] font-medium text-foreground">{title}</p>
        {description && <p className="text-[13px] text-foreground-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
