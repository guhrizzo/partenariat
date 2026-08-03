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
    <div className="flex min-h-screen bg-background-subtle">
      <AppSidebar className="hidden w-64 shrink-0 border-r border-border bg-card lg:flex" />

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <AppSidebar className="relative z-50 w-64 border-r border-border bg-card" />
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
