export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="light flex min-h-screen flex-col bg-background-subtle">
      <header className="border-b border-border bg-card px-6 py-4">
        <span className="text-lg font-semibold text-foreground">PARTENARIAT</span>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
