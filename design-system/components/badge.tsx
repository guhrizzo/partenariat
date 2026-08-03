import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-background-subtle text-foreground-muted",
      primary: "bg-primary/10 text-primary",
      success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      destructive: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
