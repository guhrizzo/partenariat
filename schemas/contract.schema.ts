import { z } from "zod";

export const contractFieldValueSchema = z.union([z.string(), z.number(), z.null()]);

export const createContractSchema = z.object({
  templateId: z.string().min(1, { error: "Selecione um modelo." }),
  clientId: z.string().min(1, { error: "Selecione um cliente." }),
  fieldValues: z.record(z.string(), contractFieldValueSchema),
});

export type CreateContractInput = z.infer<typeof createContractSchema>;
