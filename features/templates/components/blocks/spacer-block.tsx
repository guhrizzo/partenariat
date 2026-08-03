"use client";

import { Input } from "@/design-system/components/input";
import type { SpacerBlock } from "@/types";

interface SpacerBlockProps {
  block: SpacerBlock;
  onChange: (block: SpacerBlock) => void;
}

export function SpacerBlockComponent({ block, onChange }: SpacerBlockProps) {
  return (
    <div
      className="relative flex items-center justify-center rounded border border-dashed border-transparent group-hover/block:border-border"
      style={{ height: block.height }}
    >
      <div className="hidden items-center gap-1.5 group-hover/block:flex">
        <span className="text-xs text-foreground-muted">Altura</span>
        <Input
          type="number"
          min={0}
          value={block.height}
          onChange={(event) => onChange({ ...block, height: Number(event.target.value) })}
          className="h-7 w-20 text-xs"
        />
        <span className="text-xs text-foreground-muted">px</span>
      </div>
    </div>
  );
}
