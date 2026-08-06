"use client";

import { useRef } from "react";
import { FontPicker } from "@/features/templates/components/font-picker";
import { getFontFamily } from "@/features/templates/constants/fonts";
import type { ParagraphBlock } from "@/types";

interface ParagraphBlockProps {
  block: ParagraphBlock;
  onChange: (block: ParagraphBlock) => void;
}

export function ParagraphBlockComponent({ block, onChange }: ParagraphBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-1">
      <div className="hidden items-center gap-1 group-hover/block:flex">
        <FontPicker
          value={block.font}
          onChange={(font) => onChange({ ...block, font })}
        />
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onBlur={() => onChange({ ...block, html: ref.current?.innerHTML ?? block.html })}
        className="text-base leading-relaxed outline-none [&_a]:text-primary [&_a]:underline"
        style={{ fontFamily: getFontFamily(block.font) }}
        dangerouslySetInnerHTML={{ __html: block.html }}
      />
    </div>
  );
}
