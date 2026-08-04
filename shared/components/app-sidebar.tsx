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
    <nav className={cn("flex h-full flex-col gap-1 p-4", className)}>
      <Link href="/dashboard" className="mb-4 px-2 text-lg font-semibold text-foreground">
        ContractFlow
      </Link>

      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-background-subtle hover:text-foreground",
              isActive && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
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
