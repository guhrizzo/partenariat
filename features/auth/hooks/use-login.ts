"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { createSessionAction } from "@/features/auth/actions";
import type { LoginInput } from "@/features/auth/schemas";

function mapFirebaseError(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-mail ou senha incorretos.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Aguarde um instante e tente novamente.";
    default:
      return "Não foi possível entrar. Tente novamente.";
  }
}

export function useLogin() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function login(input: LoginInput) {
    setError(null);

    startTransition(async () => {
      try {
        const credential = await signInWithEmailAndPassword(auth, input.email, input.password);
        const idToken = await credential.user.getIdToken();

        const result = await createSessionAction(idToken);
        if (!result.success) {
          setError(result.error ?? "Não foi possível entrar.");
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

  return { login, error, isPending };
}
