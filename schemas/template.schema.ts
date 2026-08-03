import { z } from "zod";

const blockId = z.string().min(1);

export const headingBlockSchema = z.object({
  id: blockId,
  type: z.literal("heading"),
  text: z.string().trim().min(1),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export const subheadingBlockSchema = z.object({
  id: blockId,
  type: z.literal("subheading"),
  text: z.string().trim().min(1),
});

export const paragraphBlockSchema = z.object({
  id: blockId,
  type: z.literal("paragraph"),
  html: z.string(),
});

export const listBlockSchema = z.object({
  id: blockId,
  type: z.literal("list"),
  style: z.enum(["bullet", "numbered"]),
  items: z.array(z.string()),
});

export const tableBlockSchema = z.object({
  id: blockId,
  type: z.literal("table"),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
});

export const imageBlockSchema = z.object({
  id: blockId,
  type: z.literal("image"),
  url: z.url(),
  alt: z.string(),
  width: z.number().positive().nullable(),
});

export const dividerBlockSchema = z.object({
  id: blockId,
  type: z.literal("divider"),
});

export const spacerBlockSchema = z.object({
  id: blockId,
  type: z.literal("spacer"),
  height: z.number().min(0),
});

export const dynamicFieldBlockSchema = z.object({
  id: blockId,
  type: z.literal("dynamicField"),
  fieldKey: z.string().min(1),
  placeholder: z.string(),
});

export const signatureBlockSchema = z.object({
  id: blockId,
  type: z.literal("signature"),
  signerRole: z.string().min(1),
});

export const dateBlockSchema = z.object({
  id: blockId,
  type: z.literal("date"),
  format: z.string().min(1),
});

export const qrCodeBlockSchema = z.object({
  id: blockId,
  type: z.literal("qrCode"),
  value: z.literal("validationUrl"),
});

export const footerBlockSchema = z.object({
  id: blockId,
  type: z.literal("footer"),
  text: z.string(),
});

export const pageBreakBlockSchema = z.object({
  id: blockId,
  type: z.literal("pageBreak"),
});

export const blockSchema = z.discriminatedUnion("type", [
  headingBlockSchema,
  subheadingBlockSchema,
  paragraphBlockSchema,
  listBlockSchema,
  tableBlockSchema,
  imageBlockSchema,
  dividerBlockSchema,
  spacerBlockSchema,
  dynamicFieldBlockSchema,
  signatureBlockSchema,
  dateBlockSchema,
  qrCodeBlockSchema,
  footerBlockSchema,
  pageBreakBlockSchema,
]);

export const createTemplateSchema = z.object({
  name: z.string().trim().min(2, { error: "Informe um nome para o modelo." }),
  blocks: z.array(blockSchema).default([]),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
