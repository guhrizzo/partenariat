import { Skeleton } from "@/design-system/components/skeleton";

/**
 * Skeleton genérico usado pelos arquivos loading.tsx dos segmentos do
 * dashboard. Além de cobrir o tempo normal de carregamento, dá ao Next.js
 * uma fronteira de Suspense por rota — o que é o que permite ao
 * `experimental.useOffline` reter e repetir a navegação quando a conexão
 * cai (ver node_modules/next/dist/docs/01-app/02-guides/offline-support.md).
 */
export function PageLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
