/**
 * Espelha os tokens de cor definidos em `app/globals.css` (`@theme`). O CSS
 * é a fonte da verdade para as classes utilitárias do Tailwind; este
 * arquivo existe para contextos que precisam do valor em JS (ex.: série de
 * um gráfico, cor repassada a uma lib externa).
 */
export const colors = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryLight: "#60A5FA",
  white: "#FFFFFF",
  gray50: "#F8FAFC",
  gray200: "#E5E7EB",
  gray800: "#1F2937",
  gray950: "#111827",
} as const;

export type ColorToken = keyof typeof colors;
