import { z } from "zod";

export const contractFieldValueSchema = z.union([z.string(), z.number(), z.null()]);

export const paymentProviderSchema = z.enum(["pix", "mercadopago", "stripe"]);

export const createContractSchema = z.object({
  templateId: z.string().min(1, { error: "Selecione um modelo." }),
  clientId: z.string().min(1, { error: "Selecione um cliente." }),
  fieldValues: z.record(z.string(), contractFieldValueSchema),
  paymentAmount: z.number().positive().nullable(),
  paymentProvider: paymentProviderSchema.nullable(),
});

export type CreateContractInput = z.infer<typeof createContractSchema>;
