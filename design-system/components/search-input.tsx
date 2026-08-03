import { Search } from "lucide-react";
import { Input } from "@/design-system/components/input";
import { cn } from "@/shared/utils/cn";

export function SearchInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
      <Input type="search" className={cn("pl-9", className)} {...props} />
    </div>
  );
}
