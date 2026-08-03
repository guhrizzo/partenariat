"use client";

import { cn } from "@/shared/utils/cn";
import type { HeadingBlock } from "@/types";

interface HeadingBlockProps {
  block: HeadingBlock;
  onChange: (block: HeadingBlock) => void;
}

const LEVEL_CLASSES: Record<1 | 2 | 3, string> = {
  1: "text-3xl font-bold",
  2: "text-2xl font-bold",
  3: "text-xl font-bold",
};

export function HeadingBlockComponent({ block, onChange }: HeadingBlockProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="hidden gap-1 group-hover/block:flex">
        {([1, 2, 3] as const).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange({ ...block, level })}
            className={cn(
              "rounded px-1.5 py-0.5 text-xs font-medium text-foreground-muted hover:bg-background-subtle",
              block.level === level && "bg-primary/10 text-primary"
            )}
          >
            H{level}
          </button>
        ))}
      </div>
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(event) => onChange({ ...block, text: event.currentTarget.textContent ?? "" })}
        className={cn(LEVEL_CLASSES[block.level], "outline-none")}
      >
        {block.text}
      </div>
    </div>
  );
}
