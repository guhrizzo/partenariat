"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/design-system/components/button";
import { FontPicker } from "@/features/templates/components/font-picker";
import { getFontFamily } from "@/features/templates/constants/fonts";
import { cn } from "@/shared/utils/cn";
import type { ListBlock } from "@/types";

interface ListBlockProps {
  block: ListBlock;
  onChange: (block: ListBlock) => void;
}

export function ListBlockComponent({ block, onChange }: ListBlockProps) {
  function updateItem(index: number, value: string) {
    const items = [...block.items];
    items[index] = value;
    onChange({ ...block, items });
  }

  function addItem() {
    onChange({ ...block, items: [...block.items, ""] });
  }

  function removeItem(index: number) {
    onChange({ ...block, items: block.items.filter((_, i) => i !== index) });
  }

  const Tag = block.style === "numbered" ? "ol" : "ul";

  return (
    <div className="flex flex-col gap-2">
      <div className="hidden items-center gap-1 group-hover/block:flex">
        {(["bullet", "numbered"] as const).map((style) => (
          <button
            key={style}
            type="button"
            onClick={() => onChange({ ...block, style })}
            className={cn(
              "cursor-pointer rounded px-1.5 py-0.5 text-xs font-medium text-foreground-muted hover:bg-background-subtle",
              block.style === style && "bg-primary/10 text-primary"
            )}
          >
            {style === "bullet" ? "• Marcadores" : "1. Números"}
          </button>
        ))}
        <div className="mx-1 h-3.5 w-px bg-border" />
        <FontPicker
          value={block.font}
          onChange={(font) => onChange({ ...block, font })}
        />
      </div>
      <Tag
        className={cn("flex flex-col gap-1 pl-5", block.style === "bullet" ? "list-disc" : "list-decimal")}
        style={{ fontFamily: getFontFamily(block.font) }}
      >
        {block.items.map((item, index) => (
          <li key={index} className="group/item flex items-center gap-2">
            <input
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              className="w-full bg-transparent text-base text-foreground outline-none"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="hidden cursor-pointer text-foreground-muted hover:text-red-600 group-hover/item:block"
              aria-label="Remover item"
            >
              <X className="size-3.5" />
            </button>
          </li>
        ))}
      </Tag>
      <Button type="button" variant="ghost" size="sm" onClick={addItem} className="w-fit">
        <Plus className="size-3.5" /> Adicionar item
      </Button>
    </div>
  );
}
