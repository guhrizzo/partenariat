"use client";

import { FONT_OPTIONS } from "@/features/templates/constants/fonts";
import type { FontFamily } from "@/types";

interface FontPickerProps {
  value?: FontFamily;
  onChange: (font: FontFamily) => void;
}

export function FontPicker({ value = "inter", onChange }: FontPickerProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as FontFamily)}
      onClick={(e) => e.stopPropagation()}
      className="cursor-pointer appearance-none rounded border-none bg-transparent px-1 py-0.5 text-xs text-foreground-muted outline-none ring-1 ring-border hover:bg-background-subtle focus:ring-primary"
      aria-label="Selecionar fonte"
    >
      {FONT_OPTIONS.map((font) => (
        <option
          key={font.value}
          value={font.value}
          style={{ fontFamily: font.family }}
        >
          {font.label}
        </option>
      ))}
    </select>
  );
}
