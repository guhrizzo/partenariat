import { defineConfig, devices } from "@playwright/test";

// Suíte E2E propositalmente pequena (ver tests/e2e/README.md): um smoke
// test provando que o navegador consegue logar e chegar ao dashboard.
// A doc recomenda testar contra o build de produção — usamos `npm run
// start` aqui; o `webServer` builda antes se `.next` ainda não existir.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3700",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Builda antes de subir — garante um servidor de produção real mesmo
    // em CI ou numa checkout limpa (não presume que `.next` já existe).
    command: "npm run build && npm run start -- -p 3700",
    url: "http://localhost:3700",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
