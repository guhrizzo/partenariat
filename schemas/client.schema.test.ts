import { describe, expect, it } from "vitest";
import { createClientSchema } from "./client.schema";

const base = {
  name: "Maria Silva",
  email: "maria@example.com",
  phone: null,
  address: null,
};

describe("createClientSchema", () => {
  it("aceita um CPF válido para documentType cpf", () => {
    const result = createClientSchema.safeParse({
      ...base,
      documentType: "cpf",
      document: "529.982.247-25",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita um CPF inválido, apontando o erro no campo document", () => {
    const result = createClientSchema.safeParse({
      ...base,
      documentType: "cpf",
      document: "111.111.111-11",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["document"]);
      expect(result.error.issues[0].message).toBe("CPF inválido.");
    }
  });

  it("valida CNPJ quando documentType é cnpj (não aplica a regra de CPF)", () => {
    const result = createClientSchema.safeParse({
      ...base,
      documentType: "cnpj",
      document: "11.222.333/0001-81",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita e-mail inválido", () => {
    const result = createClientSchema.safeParse({
      ...base,
      documentType: "cpf",
      document: "529.982.247-25",
      email: "não-é-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita nome muito curto", () => {
    const result = createClientSchema.safeParse({
      ...base,
      name: "M",
      documentType: "cpf",
      document: "529.982.247-25",
    });
    expect(result.success).toBe(false);
  });
});
