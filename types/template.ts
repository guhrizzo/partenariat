export type BlockType =
  | "heading"
  | "subheading"
  | "paragraph"
  | "list"
  | "table"
  | "image"
  | "divider"
  | "spacer"
  | "dynamicField"
  | "signature"
  | "date"
  | "qrCode"
  | "footer"
  | "pageBreak";

interface BlockBase {
  id: string;
  type: BlockType;
}

export interface HeadingBlock extends BlockBase {
  type: "heading";
  text: string;
  level: 1 | 2 | 3;
}

export interface SubheadingBlock extends BlockBase {
  type: "subheading";
  text: string;
}

export interface ParagraphBlock extends BlockBase {
  type: "paragraph";
  html: string;
}

export interface ListBlock extends BlockBase {
  type: "list";
  style: "bullet" | "numbered";
  items: string[];
}

export interface TableBlock extends BlockBase {
  type: "table";
  headers: string[];
  rows: string[][];
}

export interface ImageBlock extends BlockBase {
  type: "image";
  url: string;
  alt: string;
  width: number | null;
}

export interface DividerBlock extends BlockBase {
  type: "divider";
}

export interface SpacerBlock extends BlockBase {
  type: "spacer";
  height: number;
}

export interface DynamicFieldBlock extends BlockBase {
  type: "dynamicField";
  fieldKey: string;
  placeholder: string;
}

export interface SignatureBlock extends BlockBase {
  type: "signature";
  signerRole: string;
}

export interface DateBlock extends BlockBase {
  type: "date";
  format: string;
}

export interface QrCodeBlock extends BlockBase {
  type: "qrCode";
  value: "validationUrl";
}

export interface FooterBlock extends BlockBase {
  type: "footer";
  text: string;
}

export interface PageBreakBlock extends BlockBase {
  type: "pageBreak";
}

export type Block =
  | HeadingBlock
  | SubheadingBlock
  | ParagraphBlock
  | ListBlock
  | TableBlock
  | ImageBlock
  | DividerBlock
  | SpacerBlock
  | DynamicFieldBlock
  | SignatureBlock
  | DateBlock
  | QrCodeBlock
  | FooterBlock
  | PageBreakBlock;

export type TemplateStatus = "draft" | "published";

export interface Template {
  id: string;
  organizationId: string;
  name: string;
  status: TemplateStatus;
  blocks: Block[];
  version: number;
  favoriteCount: number;
  createdAt: Date;
  updatedAt: Date;
}
