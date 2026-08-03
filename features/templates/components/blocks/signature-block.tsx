"use client";

import type { SignatureBlock } from "@/types";

interface SignatureBlockProps {
  block: SignatureBlock;
  onChange: (block: SignatureBlock) => void;
}

export function SignatureBlockComponent({ block, onChange }: SignatureBlockProps) {
  return (
    <div className="flex flex-col items-center gap-2 pt-6 text-center">
      <div className="h-px w-64 bg-foreground" />
      <input
        value={block.signerRole}
        onChange={(event) => onChange({ ...block, signerRole: event.target.value })}
        className="w-64 bg-transparent text-center text-sm text-foreground-muted outline-none"
        placeholder="Papel do signatário (ex: Contratante)"
      />
    </div>
  );
}
