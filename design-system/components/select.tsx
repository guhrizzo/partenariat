import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "flex h-8 w-full appearance-none rounded-sm border border-border bg-background px-3 pr-8 text-[13px] text-foreground transition-colors focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-foreground-muted" />
      </div>
    );
  }
);
Select.displayName = "Select";
