import type { ReactElement } from "react";

const BRAND_PRIMARY = "#0098FF";

interface AppIconOptions {
  size: number;
  /** Ícones de app na tela inicial (Android/manifest) ganham cantos arredondados;
   * o apple-touch-icon e o favicon usam bordas retas (o SO já aplica sua própria máscara). */
  rounded?: boolean;
}

/**
 * Marca monograma "P" em fundo azul da marca (#0098FF), reutilizada pelos
 * arquivos icon.tsx / apple-icon.tsx / icon-192.png / icon-512.png via
 * next/og ImageResponse — evita depender de assets de design externos.
 */
export function renderAppIcon({ size, rounded = false }: AppIconOptions): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_PRIMARY,
        borderRadius: rounded ? size * 0.22 : 0,
      }}
    >
      <span
        style={{
          fontSize: size * 0.58,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "sans-serif",
          lineHeight: 1,
          transform: `translateY(${size * 0.02}px)`,
        }}
      >
        P
      </span>
    </div>
  );
}
