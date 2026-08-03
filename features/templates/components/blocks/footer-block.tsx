"use client";

import type { FooterBlock } from "@/types";

interface FooterBlockProps {
  block: FooterBlock;
  onChange: (block: FooterBlock) => void;
}

export function FooterBlockComponent({ block, onChange }: FooterBlockProps) {
  return (
    <input
      value={block.text}
      onChange={(event) => onChange({ ...block, text: event.target.value })}
      placeholder="Texto do rodapé"
      className="w-full bg-transparent text-center text-xs text-foreground-muted outline-none"
    />
  );
}
