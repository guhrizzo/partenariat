import { ImageResponse } from "next/og";
import { renderAppIcon } from "@/lib/pwa/app-icon";

const size = 512;

export function GET() {
  return new ImageResponse(renderAppIcon({ size, rounded: true }), { width: size, height: size });
}
