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
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6">
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
        <span className="hidden text-sm font-medium text-foreground sm:block">{organizationName}</span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Avatar>
          <AvatarFallback>{initials(userName)}</AvatarFallback>
        </Avatar>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="icon" aria-label="Sair">
            <LogOut />
          </Button>
        </form>
      </div>
    </header>
  );
}
