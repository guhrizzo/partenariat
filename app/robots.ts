import type { MetadataRoute } from "next";

// App privado — sem valor de SEO, e /sign/[token] e /validate/[code] não
// devem ser indexados por buscadores (não são secretos por obscuridade
// sozinhos, mas indexação é uma superfície de exposição desnecessária).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
