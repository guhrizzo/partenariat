import { serwist } from "@serwist/next/config";

// "Modo configurador" do Serwist — necessário porque o Next.js 16 usa
// Turbopack por padrão em `next build`, e o plugin webpack clássico
// (`@serwist/next`'s `withSerwistInit`) faz o build falhar nesse caso
// (ver node_modules/next/dist/docs/.../upgrading/version-16.md, seção
// "Turbopack by default"). Este arquivo é consumido pela CLI `serwist build`,
// rodada depois do `next build` (ver script "build" em package.json).
export default serwist.withNextConfig(() => ({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
}));
