"use client";

import type { SubheadingBlock } from "@/types";

interface SubheadingBlockProps {
  block: SubheadingBlock;
  onChange: (block: SubheadingBlock) => void;
}

export function SubheadingBlockComponent({ block, onChange }: SubheadingBlockProps) {
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onBlur={(event) => onChange({ ...block, text: event.currentTarget.textContent ?? "" })}
      className="text-lg font-semibold text-foreground-muted outline-none"
    >
      {block.text}
    </div>
  );
}
