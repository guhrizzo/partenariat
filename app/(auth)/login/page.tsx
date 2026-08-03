import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Entrar — ContractFlow",
};

export default function LoginPage() {
  return <LoginForm />;
}
