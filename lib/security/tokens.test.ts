import { describe, expect, it } from "vitest";
import { generateSecureToken, generateValidationCode } from "./tokens";

describe("generateSecureToken", () => {
  it("gera hex do tamanho esperado (2 chars por byte)", () => {
    expect(generateSecureToken(32)).toMatch(/^[0-9a-f]{64}$/);
    expect(generateSecureToken(16)).toMatch(/^[0-9a-f]{32}$/);
  });

  it("nunca repete entre chamadas (alta entropia)", () => {
    const tokens = Array.from({ length: 50 }, () => generateSecureToken());
    expect(new Set(tokens).size).toBe(tokens.length);
  });
});

describe("generateValidationCode", () => {
  it("gera código do tamanho esperado, no alfabeto sem ambiguidade", () => {
    const code = generateValidationCode(10);
    expect(code).toHaveLength(10);
    expect(code).toMatch(/^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]+$/);
  });

  it("nunca inclui caracteres ambíguos (0/O, 1/I/L)", () => {
    const codes = Array.from({ length: 200 }, () => generateValidationCode(10)).join("");
    expect(codes).not.toMatch(/[01OIL]/);
  });

  it("respeita o tamanho customizado", () => {
    expect(generateValidationCode(6)).toHaveLength(6);
  });
});
