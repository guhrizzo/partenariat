import { describe, expect, it } from "vitest";
import { formatCnpj, formatCpf, formatDocument, isValidCnpj, isValidCpf, onlyDigits } from "./br-documents";

describe("onlyDigits", () => {
  it("remove tudo que não é dígito", () => {
    expect(onlyDigits("123.456.789-09")).toBe("12345678909");
    expect(onlyDigits("12.345.678/0001-95")).toBe("12345678000195");
  });
});

describe("isValidCpf", () => {
  it("aceita CPFs válidos (com e sem máscara)", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
    expect(isValidCpf("52998224725")).toBe(true);
  });

  it("rejeita dígitos verificadores incorretos", () => {
    expect(isValidCpf("529.982.247-26")).toBe(false);
  });

  it("rejeita tamanho incorreto", () => {
    expect(isValidCpf("123")).toBe(false);
    expect(isValidCpf("")).toBe(false);
  });

  it("rejeita sequências repetidas (clássico CPF inválido)", () => {
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCpf("00000000000")).toBe(false);
  });
});

describe("isValidCnpj", () => {
  it("aceita CNPJs válidos (com e sem máscara)", () => {
    expect(isValidCnpj("11.222.333/0001-81")).toBe(true);
    expect(isValidCnpj("11222333000181")).toBe(true);
  });

  it("rejeita dígitos verificadores incorretos", () => {
    expect(isValidCnpj("11.222.333/0001-82")).toBe(false);
  });

  it("rejeita tamanho incorreto e sequências repetidas", () => {
    expect(isValidCnpj("123")).toBe(false);
    expect(isValidCnpj("11111111111111")).toBe(false);
  });
});

describe("formatCpf / formatCnpj / formatDocument", () => {
  it("formata progressivamente conforme os dígitos chegam", () => {
    expect(formatCpf("529")).toBe("529");
    expect(formatCpf("529982")).toBe("529.982");
    expect(formatCpf("52998224725")).toBe("529.982.247-25");
  });

  it("ignora dígitos além do limite do documento", () => {
    expect(formatCpf("529982247259999")).toBe("529.982.247-25");
    expect(formatCnpj("11222333000181999")).toBe("11.222.333/0001-81");
  });

  it("formatDocument delega para o formatador certo pelo tipo", () => {
    expect(formatDocument("52998224725", "cpf")).toBe("529.982.247-25");
    expect(formatDocument("11222333000181", "cnpj")).toBe("11.222.333/0001-81");
  });
});
