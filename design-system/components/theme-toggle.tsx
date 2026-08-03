"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/design-system/components/button";
import { useTheme } from "@/shared/providers/theme-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
