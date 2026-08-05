"use client";

import { LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/design-system/components/avatar";
import { Button } from "@/design-system/components/button";
import { ThemeToggle } from "@/design-system/components/theme-toggle";
import { logoutAction } from "@/features/auth/actions";

interface AppHeaderProps {
  organizationName: string;
  userName: string;
  onOpenSidebar: () => void;
}

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

export function AppHeader({ organizationName, userName, onOpenSidebar }: AppHeaderProps) {
  return (
    <header className="flex h-11 items-center justify-between gap-4 border-b border-border bg-background-subtle px-3 dark:bg-panel-header sm:px-4">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Abrir menu"
          onClick={onOpenSidebar}
        >
          <Menu />
        </Button>
        <span className="hidden text-[13px] font-medium text-foreground sm:block">{organizationName}</span>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Sair"
          className="flex size-8 cursor-pointer items-center justify-center rounded-sm text-foreground-muted transition-colors hover:bg-panel-hover hover:text-foreground"
        >
          <Avatar className="size-7">
            <AvatarFallback>{initials(userName)}</AvatarFallback>
          </Avatar>
        </button>
        <form action={logoutAction}>
          <button
            type="submit"
            aria-label="Sair"
            className="flex size-8 cursor-pointer items-center justify-center rounded-sm text-foreground-muted transition-colors hover:bg-panel-hover hover:text-foreground"
          >
            <LogOut className="size-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
