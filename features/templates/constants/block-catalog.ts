import {
  Braces,
  Calendar,
  FileText,
  Heading1,
  Heading2,
  Image as ImageIcon,
  List,
  Minus,
  MoveVertical,
  PanelBottom,
  PenTool,
  QrCode,
  Table2,
  Type,
  type LucideIcon,
} from "lucide-react";
import type { BlockType } from "@/types";

interface BlockCatalogEntry {
  type: BlockType;
  label: string;
  icon: LucideIcon;
}

export const BLOCK_CATALOG: BlockCatalogEntry[] = [
  { type: "heading", label: "Título", icon: Heading1 },
  { type: "subheading", label: "Subtítulo", icon: Heading2 },
  { type: "paragraph", label: "Texto", icon: Type },
  { type: "list", label: "Lista", icon: List },
  { type: "table", label: "Tabela", icon: Table2 },
  { type: "image", label: "Imagem", icon: ImageIcon },
  { type: "divider", label: "Divisor", icon: Minus },
  { type: "spacer", label: "Espaço", icon: MoveVertical },
  { type: "dynamicField", label: "Campo Dinâmico", icon: Braces },
  { type: "signature", label: "Assinatura", icon: PenTool },
  { type: "date", label: "Data", icon: Calendar },
  { type: "qrCode", label: "QR Code", icon: QrCode },
  { type: "footer", label: "Rodapé", icon: PanelBottom },
  { type: "pageBreak", label: "Página", icon: FileText },
];
