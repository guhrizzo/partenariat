import "server-only";
import { adminStorage } from "@/firebase/admin";

/** URLs assinadas de curta duração para arquivos privados (PDF, assinatura) — nunca tornamos esses arquivos públicos. */
export async function getSignedDownloadUrl(path: string, expiresInMs = 15 * 60 * 1000): Promise<string> {
  const [url] = await adminStorage
    .bucket()
    .file(path)
    .getSignedUrl({ action: "read", expires: Date.now() + expiresInMs });
  return url;
}
