/**
 * Espelha os tokens de cor definidos em `app/globals.css` (`@theme`). O CSS
 * é a fonte da verdade para as classes utilitárias do Tailwind; este
 * arquivo existe para contextos que precisam do valor em JS (ex.: série de
 * um gráfico, cor repassada a uma lib externa).
 */
export const colors = {
  primary: "#0098FF",
  primaryDark: "#0078CC",
  primaryLight: "#4CC2FF",
  white: "#FFFFFF",
  // Chrome do app no tema escuro (Adobe CC)
  panelDark: "#2D2D2D",
  panelHeaderDark: "#383838",
  panelHoverDark: "#3F3F46",
  borderDark: "#3C3C3C",
  bgDark: "#1E1E1E",
  fgDark: "#D4D4D4",
  fgMutedDark: "#9A9A9A",
} as const;

export type ColorToken = keyof typeof colors;
