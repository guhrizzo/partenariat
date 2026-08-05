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
    <nav className={cn("flex h-full flex-col gap-0.5 p-2", className)}>
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
