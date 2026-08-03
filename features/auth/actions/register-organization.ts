"use server";

import { adminAuth, adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/constants/firestore";
import { createOrganizationSchema } from "@/schemas/organization.schema";

interface RegisterOrganizationInput {
  idToken: string;
  name: string;
  organizationName: string;
}

interface RegisterOrganizationResult {
  success: boolean;
  error?: string;
}

/**
 * Chamada logo após `createUserWithEmailAndPassword` no cliente. Cria a
 * organização e a membership do dono, e seta as custom claims no usuário
 * recém-criado. Não emite cookie de sessão — o cliente precisa forçar um
 * refresh do idToken (`getIdToken(true)`) para que as claims apareçam, e só
 * então chamar `createSessionAction`.
 */
export async function registerOrganizationAction(
  input: RegisterOrganizationInput
): Promise<RegisterOrganizationResult> {
  const parsed = createOrganizationSchema.safeParse({ name: input.organizationName });
  if (!parsed.success) {
    return { success: false, error: "Informe o nome da sua empresa." };
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(input.idToken);
  } catch {
    return { success: false, error: "Sessão inválida. Tente se registrar novamente." };
  }

  const { uid } = decoded;

  const existingUser = await adminAuth.getUser(uid);
  if (existingUser.customClaims?.orgId) {
    return { success: false, error: "Esta conta já pertence a uma organização." };
  }

  const orgRef = adminDb.collection(COLLECTIONS.organizations).doc();
  const now = new Date();

  const batch = adminDb.batch();
  batch.set(orgRef, {
    name: parsed.data.name,
    plan: "free",
    ownerUserId: uid,
    branding: { logoUrl: null, primaryColor: null },
    createdAt: now,
  });
  batch.set(orgRef.collection(COLLECTIONS.members).doc(uid), {
    userId: uid,
    organizationId: orgRef.id,
    role: "owner",
    joinedAt: now,
  });
  await batch.commit();

  await adminAuth.setCustomUserClaims(uid, { orgId: orgRef.id, role: "owner" });
  await adminAuth.updateUser(uid, { displayName: input.name });

  return { success: true };
}
