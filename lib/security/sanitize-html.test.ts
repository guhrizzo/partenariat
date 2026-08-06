import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "./sanitize-html";

describe("sanitizeHtml", () => {
  it("mantém tags de formatação permitidas", () => {
    expect(sanitizeHtml("<p><strong>Negrito</strong> e <em>itálico</em></p>")).toBe(
      "<p><strong>Negrito</strong> e <em>itálico</em></p>"
    );
  });

  it("remove tags de script e handlers inline (XSS)", () => {
    const dirty = '<p>Olá</p><script>alert(1)</script><img src=x onerror="alert(2)">';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("onerror");
    expect(clean).not.toContain("<img");
  });

  it("mantém links mas remove atributos não permitidos", () => {
    const clean = sanitizeHtml('<a href="https://example.com" onclick="evil()" style="color:red">link</a>');
    expect(clean).toContain('href="https://example.com"');
    expect(clean).not.toContain("onclick");
    expect(clean).not.toContain("style");
  });

  it("remove tags não permitidas mas preserva o texto", () => {
    expect(sanitizeHtml("<h1>Título</h1>")).toBe("Título");
  });
});
