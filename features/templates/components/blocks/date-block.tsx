"use client";

import { Input } from "@/design-system/components/input";
import type { DateBlock } from "@/types";

interface DateBlockProps {
  block: DateBlock;
  onChange: (block: DateBlock) => void;
}

export function DateBlockComponent({ block, onChange }: DateBlockProps) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-foreground">
      <span>{new Date().toLocaleDateString("pt-BR")}</span>
      <div className="hidden items-center gap-1.5 group-hover/block:flex">
        <span className="text-xs text-foreground-muted">Formato</span>
        <Input
          value={block.format}
          onChange={(event) => onChange({ ...block, format: event.target.value })}
          className="h-7 w-32 text-xs"
        />
      </div>
    </div>
  );
}
