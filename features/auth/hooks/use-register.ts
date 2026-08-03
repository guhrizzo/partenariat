"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { createSessionAction, registerOrganizationAction } from "@/features/auth/actions";
import type { RegisterInput } from "@/features/auth/schemas";

function mapFirebaseError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Já existe uma conta com este e-mail.";
    case "auth/weak-password":
      return "Senha muito fraca.";
    default:
      return "Não foi possível criar sua conta. Tente novamente.";
  }
}

export function useRegister() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function register(input: RegisterInput) {
    setError(null);
    const { name, organizationName, email, password } = input;

    startTransition(async () => {
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await credential.user.getIdToken();

        const orgResult = await registerOrganizationAction({ idToken, name, organizationName });
        if (!orgResult.success) {
          setError(orgResult.error ?? "Não foi possível criar sua organização.");
          return;
        }

        // As custom claims só aparecem no idToken após um refresh forçado.
        const freshIdToken = await credential.user.getIdToken(true);
        const sessionResult = await createSessionAction(freshIdToken);
        if (!sessionResult.success) {
          setError(sessionResult.error ?? "Não foi possível iniciar sua sessão.");
          return;
        }

        router.push("/dashboard");
        router.refresh();
      } catch (err) {
        const code = (err as { code?: string }).code ?? "";
        setError(mapFirebaseError(code));
      }
    });
  }

  return { register, error, isPending };
}
