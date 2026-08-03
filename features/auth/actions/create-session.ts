"use server";

import { adminAuth } from "@/firebase/admin";
import { createSessionCookie } from "@/lib/auth/session";

interface CreateSessionResult {
  success: boolean;
  error?: string;
}

/**
 * Troca um idToken do Firebase Auth (client SDK) por um cookie de sessão
 * httpOnly. Usada tanto no login quanto logo após o registro, quando o
 * cliente força um refresh do idToken para incorporar as custom claims
 * (`orgId`/`role`) recém-setadas.
 */
export async function createSessionAction(idToken: string): Promise<CreateSessionResult> {
  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch {
    return { success: false, error: "Não foi possível validar sua sessão. Tente novamente." };
  }

  if (!decoded.orgId || !decoded.role) {
    return { success: false, error: "Esta conta ainda não está vinculada a uma organização." };
  }

  await createSessionCookie(idToken);
  return { success: true };
}
