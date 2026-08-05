import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatCpf } from "@/lib/validators/br-documents";
import type { Block, Contract, Signature, Template } from "@/types";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 64,
    paddingHorizontal: 48,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  heading1: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  heading2: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  heading3: { fontSize: 13, fontWeight: "bold", marginBottom: 4 },
  subheading: { fontSize: 13, fontWeight: "bold", color: "#374151", marginBottom: 6 },
  paragraph: { fontSize: 11, lineHeight: 1.5, marginBottom: 8 },
  listWrapper: { marginBottom: 8 },
  listItem: { fontSize: 11, marginBottom: 2, flexDirection: "row" },
  bullet: { width: 14 },
  table: { marginBottom: 8 },
  tableRow: { flexDirection: "row" },
  tableCellHeader: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 4,
    fontWeight: "bold",
    fontSize: 10,
  },
  tableCell: { flex: 1, borderWidth: 1, borderColor: "#e5e7eb", padding: 4, fontSize: 10 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#e5e7eb", marginVertical: 8 },
  dynamicField: { fontWeight: "bold" },
  image: { maxWidth: "100%", marginBottom: 8 },
  signatureBlock: { alignItems: "center", marginTop: 24, marginBottom: 8 },
  signatureLine: { borderBottomWidth: 1, borderBottomColor: "#111827", width: 240, marginBottom: 4 },
  signatureRole: { fontSize: 10, color: "#6b7280" },
  evidenceBox: {
    marginTop: 24,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 9,
    color: "#374151",
  },
  evidenceLine: { marginBottom: 2 },
  signatureImage: { width: 160, marginTop: 6 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 6,
  },
  footerText: { fontSize: 8, color: "#6b7280" },
});

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

function resolveFieldText(
  fieldKey: string,
  placeholder: string,
  fieldValues: Contract["fieldValues"]
): string {
  const value = fieldValues[fieldKey];
  if (value === undefined || value === null || value === "") return `{{${placeholder}}}`;
  return String(value);
}

function renderBlock(block: Block, fieldValues: Contract["fieldValues"], key: number) {
  switch (block.type) {
    case "heading": {
      const style =
        block.level === 1 ? styles.heading1 : block.level === 2 ? styles.heading2 : styles.heading3;
      return (
        <Text key={key} style={style}>
          {block.text}
        </Text>
      );
    }
    case "subheading":
      return (
        <Text key={key} style={styles.subheading}>
          {block.text}
        </Text>
      );
    case "paragraph":
      return (
        <Text key={key} style={styles.paragraph}>
          {stripHtml(block.html)}
        </Text>
      );
    case "list":
      return (
        <View key={key} style={styles.listWrapper}>
          {block.items.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>{block.style === "numbered" ? `${index + 1}.` : "•"}</Text>
              <Text>{item}</Text>
            </View>
          ))}
        </View>
      );
    case "table":
      return (
        <View key={key} style={styles.table}>
          <View style={styles.tableRow}>
            {block.headers.map((header, index) => (
              <Text key={index} style={styles.tableCellHeader}>
                {header}
              </Text>
            ))}
          </View>
          {block.rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {row.map((cell, cellIndex) => (
                <Text key={cellIndex} style={styles.tableCell}>
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      );
    case "image":
      // eslint-disable-next-line jsx-a11y/alt-text -- <Image> aqui é a primitiva do @react-pdf/renderer, não <img> do DOM.
      return block.url ? <Image key={key} src={block.url} style={styles.image} /> : null;
    case "divider":
      return <View key={key} style={styles.divider} />;
    case "spacer":
      return <View key={key} style={{ height: block.height }} />;
    case "dynamicField":
      return (
        <Text key={key} style={styles.dynamicField}>
          {resolveFieldText(block.fieldKey, block.placeholder, fieldValues)}
        </Text>
      );
    case "signature":
      return (
        <View key={key} style={styles.signatureBlock}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureRole}>{block.signerRole}</Text>
        </View>
      );
    case "date":
      return <Text key={key}>{new Date().toLocaleDateString("pt-BR")}</Text>;
    case "qrCode":
      return null;
    case "footer":
      return (
        <Text key={key} style={styles.footerText}>
          {block.text}
        </Text>
      );
    case "pageBreak":
      return <View key={key} break />;
    default:
      return null;
  }
}

interface ContractPdfDocumentProps {
  template: Template;
  contract: Contract;
  signatures: Signature[];
  signatureImages: Record<string, string>;
}

export function ContractPdfDocument({
  template,
  contract,
  signatures,
  signatureImages,
}: ContractPdfDocumentProps) {
  return (
    <Document title={template.name}>
      <Page size="A4" style={styles.page} wrap>
        {template.blocks.map((block, index) => renderBlock(block, contract.fieldValues, index))}

        {signatures.map((signature) => (
          <View key={signature.id} style={styles.evidenceBox}>
            <Text style={styles.evidenceLine}>
              Assinado por: {signature.signerName} (CPF: {formatCpf(signature.signerDocument)})
            </Text>
            <Text style={styles.evidenceLine}>
              Data/hora: {signature.signedAt.toLocaleString("pt-BR")}
            </Text>
            <Text style={styles.evidenceLine}>IP: {signature.ip}</Text>
            {signatureImages[signature.id] && (
              // eslint-disable-next-line jsx-a11y/alt-text -- <Image> aqui é a primitiva do @react-pdf/renderer, não <img> do DOM.
              <Image src={signatureImages[signature.id]} style={styles.signatureImage} />
            )}
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Hash: {contract.documentHash?.slice(0, 16) ?? "—"}... | Código: {contract.validationCode ?? "—"}
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
