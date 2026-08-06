"use client";

import { useState } from "react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

interface AppShellProps {
  organizationName: string;
  userName: string;
  children: React.ReactNode;
}

export function AppShell({ organizationName, userName, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // `items-stretch` (default no flex, mas explícito para garantir) +
    // `min-h-screen` no pai: a sidebar estica até a altura do filho mais
    // alto (o `<main>` quando o conteúdo do contrato é maior que a
    // viewport). Sem o `items-stretch` explícito, alguns engines
    // colapsam o stretch quando o irmão usa `flex-1 flex-col`.
    <div className="flex min-h-screen items-stretch bg-background">
      <AppSidebar className="hidden w-56 shrink-0 border-r border-border bg-background-subtle dark:bg-panel lg:flex" />

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 cursor-pointer bg-black/60"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <AppSidebar className="relative z-50 w-64 border-r border-border bg-background-subtle dark:bg-panel" />
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <AppHeader
          organizationName={organizationName}
          userName={userName}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
