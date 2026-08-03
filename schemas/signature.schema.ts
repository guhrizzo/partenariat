import { z } from "zod";

/**
 * Campos que o próprio signatário informa no navegador. IP, user agent e
 * timestamp NÃO vêm daqui — são extraídos no servidor a partir da requisição
 * para não permitir que o cliente falsifique a evidência de assinatura.
 */
export const signContractSchema = z.object({
  signerName: z.string().trim().min(2, { error: "Informe o nome completo." }),
  signerDocument: z.string().trim().min(11, { error: "Informe um CPF válido." }),
  signatureImageDataUrl: z
    .string()
    .startsWith("data:image/png;base64,", { error: "Assinatura inválida." }),
  language: z.string().trim().min(2),
  timezone: z.string().trim().min(1),
  consent: z.literal(true, {
    error: "É necessário aceitar os termos para assinar.",
  }),
});

export type SignContractInput = z.infer<typeof signContractSchema>;
