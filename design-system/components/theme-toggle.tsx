"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/providers/theme-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex size-8 cursor-pointer items-center justify-center rounded-sm border border-transparent text-foreground-muted transition-colors hover:border-border hover:bg-panel-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
