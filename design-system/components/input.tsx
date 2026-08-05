import * as React from "react";
import { cn } from "@/shared/utils/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-8 w-full rounded-sm border border-border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-foreground-muted/60 transition-colors focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
