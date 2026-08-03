import { z } from "zod";

export const fieldTypeSchema = z.enum([
  "text",
  "number",
  "currency",
  "date",
  "email",
  "phone",
  "cpf",
  "cnpj",
  "textarea",
  "select",
]);

export const fieldOptionSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

export const createFieldDefinitionSchema = z.object({
  key: z
    .string()
    .trim()
    .regex(/^[a-z][a-zA-Z0-9]*$/, {
      error: "A chave deve estar em camelCase, iniciando com letra minúscula.",
    }),
  label: z.string().trim().min(1, { error: "Informe um rótulo." }),
  type: fieldTypeSchema,
  required: z.boolean(),
  options: z.array(fieldOptionSchema).nullable(),
});

export type CreateFieldDefinitionInput = z.infer<typeof createFieldDefinitionSchema>;
