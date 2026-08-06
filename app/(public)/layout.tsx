import { ThemeToggle } from "@/design-system/components/theme-toggle";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background-subtle">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-6 sm:py-4">
        <span className="text-base font-semibold text-foreground sm:text-lg">PARTENARIAT</span>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
