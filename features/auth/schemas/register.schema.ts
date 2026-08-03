import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, { error: "Informe seu nome completo." }),
  organizationName: z.string().trim().min(2, { error: "Informe o nome da sua empresa." }),
  email: z.email({ error: "Informe um e-mail válido." }),
  password: z
    .string()
    .min(8, { error: "A senha deve ter ao menos 8 caracteres." })
    .regex(/[a-zA-Z]/, { error: "A senha deve conter ao menos uma letra." })
    .regex(/[0-9]/, { error: "A senha deve conter ao menos um número." }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
