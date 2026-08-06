import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { ToastProvider } from "@/shared/providers/toast-provider";
import { OfflineBanner } from "@/shared/components/offline-banner";
import { RegisterServiceWorker } from "@/lib/pwa/register-service-worker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PARTENARIAT",
  description: "Gestão de contratos eletrônicos para freelancers, agências e pequenos negócios.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1e1e" },
  ],
};

// Roda antes da hidratação para aplicar o tema salvo sem flash visual.
// A classe é setada diretamente no <html>, fora do controle do React —
// por isso o suppressHydrationWarning abaixo.
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <ThemeProvider>
          <ToastProvider>
            <RegisterServiceWorker />
            <OfflineBanner />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
