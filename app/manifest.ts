import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PARTENARIAT — Gestão de Contratos",
    short_name: "PARTENARIAT",
    description: "Gestão de contratos eletrônicos para freelancers, agências e pequenos negócios.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0098ff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
