import { describe, expect, it } from "vitest";
import { createContractSchema } from "./contract.schema";

const base = {
  templateId: "template-1",
  clientId: "client-1",
  fieldValues: { nome: "Maria", idade: 30 },
};

describe("createContractSchema", () => {
  it("aceita um contrato sem pagamento (ambos nulos)", () => {
    const result = createContractSchema.safeParse({
      ...base,
      paymentAmount: null,
      paymentProvider: null,
    });
    expect(result.success).toBe(true);
  });

  it("aceita um contrato com pagamento configurado", () => {
    const result = createContractSchema.safeParse({
      ...base,
      paymentAmount: 150.5,
      paymentProvider: "mercadopago",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita valor de pagamento negativo ou zero", () => {
    expect(
      createContractSchema.safeParse({ ...base, paymentAmount: 0, paymentProvider: "pix" }).success
    ).toBe(false);
    expect(
      createContractSchema.safeParse({ ...base, paymentAmount: -10, paymentProvider: "pix" }).success
    ).toBe(false);
  });

  it("rejeita templateId ou clientId vazios", () => {
    expect(
      createContractSchema.safeParse({ ...base, templateId: "", paymentAmount: null, paymentProvider: null })
        .success
    ).toBe(false);
    expect(
      createContractSchema.safeParse({ ...base, clientId: "", paymentAmount: null, paymentProvider: null })
        .success
    ).toBe(false);
  });

  it("rejeita provedor de pagamento desconhecido", () => {
    const result = createContractSchema.safeParse({
      ...base,
      paymentAmount: 100,
      paymentProvider: "boleto",
    });
    expect(result.success).toBe(false);
  });

  it("aceita valores de campo string, number ou null", () => {
    const result = createContractSchema.safeParse({
      ...base,
      fieldValues: { a: "texto", b: 42, c: null },
      paymentAmount: null,
      paymentProvider: null,
    });
    expect(result.success).toBe(true);
  });
});
