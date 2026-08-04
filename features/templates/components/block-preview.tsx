import { QrCode } from "lucide-react";
import { DocumentPage } from "@/features/templates/components/document-page";
import type { Block, ContractFieldValue } from "@/types";

interface BlockPreviewProps {
  blocks: Block[];
  fieldValues?: Record<string, ContractFieldValue>;
}

function resolveFieldValue(
  fieldKey: string,
  placeholder: string,
  fieldValues?: Record<string, ContractFieldValue>
) {
  const value = fieldValues?.[fieldKey];
  if (value === undefined || value === null || value === "") {
    return { text: `{{${placeholder}}}`, filled: false };
  }
  return { text: String(value), filled: true };
}

/**
 * Renderizador somente leitura — reaproveita o mesmo `DocumentPage` do
 * editor (Fase 4) para que o preview seja visualmente idêntico ao que virá
 * a ser o PDF final. Usado no wizard de criação (Fase 5), no detalhe do
 * contrato, e futuramente na página pública de assinatura (Fase 6).
 */
export function BlockPreview({ blocks, fieldValues }: BlockPreviewProps) {
  return (
    <div className="light">
      <DocumentPage>
        <div className="flex flex-col gap-3">
          {blocks.map((block) => {
            switch (block.type) {
              case "heading": {
                const sizeClass =
                  block.level === 1 ? "text-3xl" : block.level === 2 ? "text-2xl" : "text-xl";
                if (block.level === 1) {
                  return (
                    <h1 key={block.id} className={`${sizeClass} font-bold`}>
                      {block.text}
                    </h1>
                  );
                }
                if (block.level === 2) {
                  return (
                    <h2 key={block.id} className={`${sizeClass} font-bold`}>
                      {block.text}
                    </h2>
                  );
                }
                return (
                  <h3 key={block.id} className={`${sizeClass} font-bold`}>
                    {block.text}
                  </h3>
                );
              }
              case "subheading":
                return (
                  <h4 key={block.id} className="text-lg font-semibold text-foreground-muted">
                    {block.text}
                  </h4>
                );
              case "paragraph":
                return (
                  <div
                    key={block.id}
                    className="text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: block.html }}
                  />
                );
              case "list": {
                const items = block.items.map((item, index) => <li key={index}>{item}</li>);
                return block.style === "numbered" ? (
                  <ol key={block.id} className="flex flex-col gap-1 pl-5 list-decimal">
                    {items}
                  </ol>
                ) : (
                  <ul key={block.id} className="flex flex-col gap-1 pl-5 list-disc">
                    {items}
                  </ul>
                );
              }
              case "table":
                return (
                  <table key={block.id} className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        {block.headers.map((header, index) => (
                          <th key={index} className="border border-border p-2 text-left font-semibold">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border border-border p-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              case "image":
                return block.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={block.id}
                    src={block.url}
                    alt={block.alt}
                    style={block.width ? { width: block.width } : undefined}
                    className="max-w-full rounded-md"
                  />
                ) : null;
              case "divider":
                return <hr key={block.id} className="border-border" />;
              case "spacer":
                return <div key={block.id} style={{ height: block.height }} />;
              case "dynamicField": {
                const resolved = resolveFieldValue(block.fieldKey, block.placeholder, fieldValues);
                return (
                  <span
                    key={block.id}
                    className={resolved.filled ? "font-medium" : "font-medium text-primary"}
                  >
                    {resolved.text}
                  </span>
                );
              }
              case "signature":
                return (
                  <div key={block.id} className="flex flex-col items-center gap-2 pt-6 text-center">
                    <div className="h-px w-64 bg-foreground" />
                    <span className="text-sm text-foreground-muted">{block.signerRole}</span>
                  </div>
                );
              case "date":
                return (
                  <span key={block.id} className="text-sm">
                    {new Date().toLocaleDateString("pt-BR")}
                  </span>
                );
              case "qrCode":
                return (
                  <div
                    key={block.id}
                    className="flex size-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-foreground-muted"
                  >
                    <QrCode className="size-6" />
                    <span className="text-[10px]">Validação</span>
                  </div>
                );
              case "footer":
                return (
                  <p key={block.id} className="text-center text-xs text-foreground-muted">
                    {block.text}
                  </p>
                );
              case "pageBreak":
                return <div key={block.id} className="border-t border-dashed border-border" />;
              default:
                return null;
            }
          })}
        </div>
      </DocumentPage>
    </div>
  );
}
