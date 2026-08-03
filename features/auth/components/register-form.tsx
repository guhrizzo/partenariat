"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/design-system/components/button";
import { Input } from "@/design-system/components/input";
import { Label } from "@/design-system/components/label";
import { useRegister } from "@/features/auth/hooks";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas";

export function RegisterForm() {
  const { register: registerAccount, error, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  return (
    <form onSubmit={handleSubmit(registerAccount)} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" autoComplete="name" {...register("name")} />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="organizationName">Nome da empresa</Label>
        <Input id="organizationName" autoComplete="organization" {...register("organizationName")} />
        {errors.organizationName && (
          <p className="text-sm text-red-600">{errors.organizationName.message}</p>
        )}
      </div>

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
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending ? "Criando conta..." : "Criar conta"}
      </Button>

      <p className="text-center text-sm text-foreground-muted">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
