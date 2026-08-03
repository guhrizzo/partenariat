import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/constants/firestore";
import { verifySession } from "@/lib/auth/dal";
import { AppShell } from "@/shared/components";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  const orgSnap = await adminDb
    .collection(COLLECTIONS.organizations)
    .doc(session.organizationId)
    .get();
  const organizationName = (orgSnap.data()?.name as string | undefined) ?? "Minha empresa";

  return (
    <AppShell organizationName={organizationName} userName={session.name ?? session.email}>
      {children}
    </AppShell>
  );
}
