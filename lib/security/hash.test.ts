import { describe, expect, it } from "vitest";
import { sha256 } from "./hash";

describe("sha256", () => {
  it("produz um hash hexadecimal de 64 caracteres", () => {
    const hash = sha256("conteúdo do contrato");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("é determinístico para a mesma entrada", () => {
    expect(sha256("mesmo texto")).toBe(sha256("mesmo texto"));
  });

  it("muda com qualquer alteração na entrada (evidência de integridade)", () => {
    expect(sha256("Cláusula 1: valor R$ 100")).not.toBe(sha256("Cláusula 1: valor R$ 101"));
  });

  it("bate com o vetor de teste conhecido do SHA-256", () => {
    // https://en.wikipedia.org/wiki/SHA-2#Test_vectors
    expect(sha256("")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });
});
