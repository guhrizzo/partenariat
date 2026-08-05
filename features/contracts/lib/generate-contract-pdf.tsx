import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import { adminStorage } from "@/firebase/admin";
import { generateValidationCode } from "@/lib/security/tokens";
import { listSignatures } from "@/features/contracts/repositories/signature-repository";
import { setContractPdf } from "@/features/contracts/repositories/contract-repository";
import { logContractEvent } from "@/features/contracts/repositories/audit-log-repository";
import { ContractPdfDocument } from "@/features/contracts/components/pdf/contract-pdf-document";
import type { Contract, Signature, Template } from "@/types";

async function loadSignatureImages(signatures: Signature[]): Promise<Record<string, string>> {
  const entries = await Promise.all(
    signatures.map(async (signature) => {
      try {
        const [buffer] = await adminStorage.bucket().file(signature.signatureImageUrl).download();
        return [signature.id, `data:image/png;base64,${buffer.toString("base64")}`] as const;
      } catch {
        return [signature.id, null] as const;
      }
    })
  );
  return Object.fromEntries(entries.filter((entry) => entry[1] !== null)) as Record<string, string>;
}

/**
 * Chamada de forma síncrona logo após a assinatura (dentro da mesma Server
 * Action) em vez de via Cloud Function: este projeto não tem infra de
 * Functions implantada, e o volume esperado torna a geração inline viável.
 * Falhas aqui não devem derrubar a assinatura em si — quem chama decide.
 */
export async function generateContractPdf(contract: Contract, template: Template): Promise<void> {
  const signatures = await listSignatures(contract.id);
  const signatureImages = await loadSignatureImages(signatures);

  const buffer = await renderToBuffer(
    <ContractPdfDocument
      template={template}
      contract={contract}
      signatures={signatures}
      signatureImages={signatureImages}
    />
  );

  const path = `organizations/${contract.organizationId}/contracts/${contract.id}/document.pdf`;
  await adminStorage.bucket().file(path).save(buffer, { contentType: "application/pdf" });

  const validationCode = generateValidationCode();
  await setContractPdf(contract.id, path, validationCode);
  await logContractEvent(contract.id, "pdf_generated", null, {});
}
