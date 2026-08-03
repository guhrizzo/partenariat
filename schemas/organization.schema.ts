import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2, { error: "Informe o nome da organização." }),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
