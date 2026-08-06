import { expect, test } from "@playwright/test";

// Smoke test: prova que o fluxo de autenticação real (Firebase Auth client
// SDK → Server Action de sessão → redirect) funciona de ponta a ponta
// contra um build de produção real, incluindo os cabeçalhos de segurança
// e a CSP da Fase 11 (se a CSP bloquear identitytoolkit.googleapis.com,
// este teste falha no login).
//
// Precisa de uma conta já existente no projeto Firebase configurado em
// .env.local — não criamos usuários aqui para não acoplar o teste a
// side-effects de escrita. Defina E2E_TEST_EMAIL/E2E_TEST_PASSWORD para
// apontar para outra conta; por padrão usa a conta de teste criada durante
// a validação manual da Fase 10.
const EMAIL = process.env.E2E_TEST_EMAIL ?? "pwa-test@partenariat.local";
const PASSWORD = process.env.E2E_TEST_PASSWORD ?? "TestePWA123!";

test("login redireciona para o dashboard e mostra a navegação principal", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("PARTENARIAT")).toBeVisible();

  await page.getByLabel("E-mail").fill(EMAIL);
  await page.getByLabel("Senha").fill(PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();

  // A chamada real ao Firebase Auth (identitytoolkit.googleapis.com) mais o
  // redirect via Server Action costumam passar de 5s no cold start do teste.
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
  await expect(page.getByRole("link", { name: "Contratos" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Clientes" })).toBeVisible();
});

test("rota inexistente mostra a página 404 customizada", async ({ page }) => {
  await page.goto("/rota-que-nao-existe");
  await expect(page.getByText("Página não encontrada")).toBeVisible();
});
