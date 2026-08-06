import { ImageResponse } from "next/og";
import { renderAppIcon } from "@/lib/pwa/app-icon";

const size = 192;

// Ícone dedicado ao manifest (instalação em tela inicial) — precisa de um
// caminho estático próprio, já que os campos `src` do manifest não podem
// apontar para a rota gerada por app/icon.tsx (essa é só para o <link rel="icon">).
export function GET() {
  return new ImageResponse(renderAppIcon({ size, rounded: true }), { width: size, height: size });
}
