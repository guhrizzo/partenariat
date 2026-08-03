import type { Block, BlockType } from "@/types";

export function createBlock(type: BlockType): Block {
  const id = crypto.randomUUID();

  switch (type) {
    case "heading":
      return { id, type, text: "Título", level: 1 };
    case "subheading":
      return { id, type, text: "Subtítulo" };
    case "paragraph":
      return { id, type, html: "<p>Digite o texto aqui...</p>" };
    case "list":
      return { id, type, style: "bullet", items: ["Item 1"] };
    case "table":
      return {
        id,
        type,
        headers: ["Coluna 1", "Coluna 2"],
        rows: [
          ["", ""],
          ["", ""],
        ],
      };
    case "image":
      return { id, type, url: "", alt: "", width: null };
    case "divider":
      return { id, type };
    case "spacer":
      return { id, type, height: 24 };
    case "dynamicField":
      return { id, type, fieldKey: "nome", placeholder: "Nome" };
    case "signature":
      return { id, type, signerRole: "Contratante" };
    case "date":
      return { id, type, format: "DD/MM/YYYY" };
    case "qrCode":
      return { id, type, value: "validationUrl" };
    case "footer":
      return { id, type, text: "" };
    case "pageBreak":
      return { id, type };
  }
}
