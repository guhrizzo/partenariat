# Testes E2E (Playwright)

Suíte deliberadamente pequena: um smoke test (`login.spec.ts`) provando que
o harness funciona e que o fluxo de login real (Firebase Auth → sessão →
dashboard) não quebra sob os cabeçalhos de segurança da Fase 11.

## O que falta (fora do escopo desta fase)

Uma suíte E2E completa cobrindo os fluxos críticos de negócio — criar
cliente, criar modelo, montar contrato, assinar publicamente, gerar PDF,
pagamento — é trabalho contínuo, não um item de configuração única. Fica
para ser construído incrementalmente conforme cada fluxo estabiliza,
seguindo o mesmo padrão deste primeiro teste.

## Rodando

```bash
npx playwright test
```

O `webServer` do `playwright.config.ts` builda e sobe a aplicação em modo
produção automaticamente (porta 3700). Requer `.env.local` configurado com
um projeto Firebase real e a conta de teste referenciada em
`login.spec.ts` (ou as variáveis `E2E_TEST_EMAIL`/`E2E_TEST_PASSWORD`
apontando para outra conta existente).
