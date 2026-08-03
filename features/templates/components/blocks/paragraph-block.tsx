"use client";

import { useRef } from "react";
import type { ParagraphBlock } from "@/types";

interface ParagraphBlockProps {
  block: ParagraphBlock;
  onChange: (block: ParagraphBlock) => void;
}

export function ParagraphBlockComponent({ block, onChange }: ParagraphBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={() => onChange({ ...block, html: ref.current?.innerHTML ?? block.html })}
      className="text-base leading-relaxed outline-none [&_a]:text-primary [&_a]:underline"
      dangerouslySetInnerHTML={{ __html: block.html }}
    />
  );
}
