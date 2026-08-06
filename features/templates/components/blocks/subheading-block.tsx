"use client";

import { FontPicker } from "@/features/templates/components/font-picker";
import { getFontFamily } from "@/features/templates/constants/fonts";
import type { SubheadingBlock } from "@/types";

interface SubheadingBlockProps {
  block: SubheadingBlock;
  onChange: (block: SubheadingBlock) => void;
}

export function SubheadingBlockComponent({ block, onChange }: SubheadingBlockProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="hidden items-center gap-1 group-hover/block:flex">
        <FontPicker
          value={block.font}
          onChange={(font) => onChange({ ...block, font })}
        />
      </div>
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(event) => onChange({ ...block, text: event.currentTarget.textContent ?? "" })}
        className="text-lg font-semibold text-foreground-muted outline-none"
        style={{ fontFamily: getFontFamily(block.font) }}
      >
        {block.text}
      </div>
    </div>
  );
}
