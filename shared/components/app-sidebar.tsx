"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, LayoutTemplate, Users } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contracts", label: "Contratos", icon: FileText },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/templates", label: "Modelos", icon: LayoutTemplate },
];

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    // Sem `h-full` aqui: a altura vem do wrapper `<aside>` em app-shell.tsx
    // (que usa `self-stretch` no flex column do pai). O `h-full` forçava o
    // `<nav>` a 100% do wrapper, mas como o wrapper não tem altura
    // intrínseca quando é o item mais curto do flex, o nav colapsava para
    // a altura do conteúdo (lista de links), fazendo o bg/border não
    // cobrirem toda a coluna.
    <nav className={cn("flex flex-col gap-0.5 p-2", className)}>
      <Link
        href="/dashboard"
        className="mb-2 flex cursor-pointer items-center px-2 py-1.5 text-[15px] font-semibold tracking-tight text-foreground"
      >
        PARTENARIAT
      </Link>

      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] text-foreground-muted transition-colors hover:bg-panel-hover hover:text-foreground",
              isActive &&
                "bg-selection text-foreground hover:bg-selection hover:text-foreground dark:bg-selection"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
