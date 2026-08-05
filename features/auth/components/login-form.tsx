"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/design-system/components/button";
import { Input } from "@/design-system/components/input";
import { Label } from "@/design-system/components/label";
import { useLogin } from "@/features/auth/hooks";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";

export function LoginForm() {
  const { login, error, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  return (
    <form onSubmit={handleSubmit(login)} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending ? "Entrando..." : "Entrar"}
      </Button>

      <p className="text-center text-sm text-foreground-muted">
        Ainda não tem conta?{" "}
        <Link href="/register" className="cursor-pointer font-medium text-primary hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
