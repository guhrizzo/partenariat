"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@/design-system/components/button";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// global-error substitui o layout raiz inteiro quando um erro não capturado
// escapa de todo error.tsx de segmento — por isso precisa da própria tag
// <html>/<body>, fontes e estilos globais (não herda nada do RootLayout).
// Ver node_modules/next/dist/docs/.../file-conventions/error.md.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("contractflow-theme");
    var theme = stored === "light" || stored === "dark" ? stored : "system";
    var resolved =
      theme === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : theme;
    document.documentElement.classList.add(resolved);
  } catch (e) {}
})();
`;

interface GlobalErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function GlobalError({ retry }: GlobalErrorProps) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <title>Algo deu errado — PARTENARIAT</title>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <div className="flex min-h-screen items-center justify-center bg-background-subtle px-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 text-center shadow-sm">
            <h1 className="text-lg font-semibold text-foreground">Algo deu errado</h1>
            <p className="mt-2 text-sm text-foreground-muted">
              Ocorreu um erro inesperado. Você pode tentar novamente.
            </p>
            <Button type="button" size="sm" className="mt-6" onClick={() => retry()}>
              Tentar novamente
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
