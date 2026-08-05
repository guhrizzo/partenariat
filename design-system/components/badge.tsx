import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "border-border bg-panel text-foreground-muted",
        primary: "border-primary/40 bg-primary/15 text-primary",
        success:
          "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        warning: "border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400",
        destructive: "border-red-500/40 bg-red-500/15 text-red-600 dark:text-red-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
