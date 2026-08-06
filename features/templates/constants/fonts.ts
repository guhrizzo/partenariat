import type { FontFamily } from "@/types";

export interface FontOption {
  label: string;
  value: FontFamily;
  family: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { label: "Inter",            value: "inter",        family: "var(--font-inter), sans-serif" },
  { label: "Merriweather",     value: "merriweather", family: "var(--font-merriweather), serif" },
  { label: "Montserrat",       value: "montserrat",   family: "var(--font-montserrat), sans-serif" },
  { label: "Roboto",           value: "roboto",       family: "var(--font-roboto), sans-serif" },
  { label: "Lato",             value: "lato",         family: "var(--font-lato), sans-serif" },
  { label: "Open Sans",        value: "open-sans",    family: "var(--font-open-sans), sans-serif" },
  { label: "Courier New",      value: "courier-new",  family: "'Courier New', Courier, monospace" },
  { label: "Playfair Display", value: "playfair",     family: "var(--font-playfair), serif" },
];

export const DEFAULT_FONT: FontFamily = "inter";

export function getFontFamily(font?: FontFamily): string {
  if (!font) return FONT_OPTIONS[0].family;
  return FONT_OPTIONS.find((f) => f.value === font)?.family ?? FONT_OPTIONS[0].family;
}
