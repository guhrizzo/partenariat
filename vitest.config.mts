import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    // "server-only" só é um no-op sob a condição de export "react-server"
    // (é assim que o bundler do Next.js resolve; sem isso o pacote lança
    // erro ao ser importado — e vários módulos testados aqui, tipo
    // lib/security/*.ts, começam com `import "server-only"`).
    conditions: ["react-server"],
  },
  // Vitest roda os arquivos de teste pelo pipeline de SSR do Vite, que usa
  // sua própria lista de condições — `resolve.conditions` sozinho não
  // cobre esse caminho.
  ssr: {
    resolve: {
      conditions: ["react-server"],
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "tests/**"],
  },
});
