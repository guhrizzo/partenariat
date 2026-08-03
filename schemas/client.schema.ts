import { z } from "zod";
import { isValidCnpj, isValidCpf } from "@/lib/validators/br-documents";

export const clientDocumentTypeSchema = z.enum(["cpf", "cnpj"]);

export const clientAddressSchema = z.object({
  street: z.string().trim().min(1).nullable(),
  city: z.string().trim().min(1).nullable(),
  state: z.string().trim().min(1).nullable(),
  zipCode: z.string().trim().min(1).nullable(),
});

export const createClientSchema = z
  .object({
    name: z.string().trim().min(2, { error: "Informe o nome completo." }),
    documentType: clientDocumentTypeSchema,
    document: z.string().trim().min(1, { error: "Informe um documento." }),
    email: z.email({ error: "Informe um e-mail válido." }),
    phone: z.string().trim().nullable(),
    address: clientAddressSchema.nullable(),
  })
  .check((ctx) => {
    const { documentType, document } = ctx.value;
    const isValid = documentType === "cpf" ? isValidCpf(document) : isValidCnpj(document);
    if (!isValid) {
      ctx.issues.push({
        code: "custom",
        message: documentType === "cpf" ? "CPF inválido." : "CNPJ inválido.",
        path: ["document"],
        input: document,
      });
    }
  });

export type CreateClientInput = z.infer<typeof createClientSchema>;
