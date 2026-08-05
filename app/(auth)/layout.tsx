import { redirect } from "next/navigation";
import { getOptionalSession } from "@/lib/auth/dal";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getOptionalSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-subtle px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-1 text-center">
          <span className="text-xl font-semibold text-foreground">PARTENARIAT</span>
          <p className="text-sm text-foreground-muted">Gestão de contratos eletrônicos</p>
        </div>
        {children}
      </div>
    </div>
  );
}
