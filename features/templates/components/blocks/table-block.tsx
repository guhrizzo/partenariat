"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/design-system/components/button";
import type { TableBlock } from "@/types";

interface TableBlockProps {
  block: TableBlock;
  onChange: (block: TableBlock) => void;
}

export function TableBlockComponent({ block, onChange }: TableBlockProps) {
  function updateHeader(index: number, value: string) {
    const headers = [...block.headers];
    headers[index] = value;
    onChange({ ...block, headers });
  }

  function updateCell(rowIndex: number, colIndex: number, value: string) {
    const rows = block.rows.map((row) => [...row]);
    rows[rowIndex][colIndex] = value;
    onChange({ ...block, rows });
  }

  function addColumn() {
    onChange({
      ...block,
      headers: [...block.headers, `Coluna ${block.headers.length + 1}`],
      rows: block.rows.map((row) => [...row, ""]),
    });
  }

  function removeColumn(index: number) {
    onChange({
      ...block,
      headers: block.headers.filter((_, i) => i !== index),
      rows: block.rows.map((row) => row.filter((_, i) => i !== index)),
    });
  }

  function addRow() {
    onChange({ ...block, rows: [...block.rows, block.headers.map(() => "")] });
  }

  function removeRow(index: number) {
    onChange({ ...block, rows: block.rows.filter((_, i) => i !== index) });
  }

  return (
    <div className="flex flex-col gap-2">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {block.headers.map((header, index) => (
              <th key={index} className="group/col relative border border-border p-1">
                <input
                  value={header}
                  onChange={(event) => updateHeader(index, event.target.value)}
                  className="w-full bg-transparent font-semibold text-foreground outline-none"
                />
                {block.headers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeColumn(index)}
                    className="absolute -top-2 right-0 hidden cursor-pointer text-foreground-muted hover:text-red-600 group-hover/col:block"
                    aria-label="Remover coluna"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="group/row">
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border border-border p-1">
                  <input
                    value={cell}
                    onChange={(event) => updateCell(rowIndex, colIndex, event.target.value)}
                    className="w-full bg-transparent text-foreground outline-none"
                  />
                </td>
              ))}
              <td className="w-0 p-0">
                <button
                  type="button"
                  onClick={() => removeRow(rowIndex)}
                  className="hidden cursor-pointer text-foreground-muted hover:text-red-600 group-hover/row:block"
                  aria-label="Remover linha"
                >
                  <X className="size-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={addRow}>
          <Plus className="size-3.5" /> Linha
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={addColumn}>
          <Plus className="size-3.5" /> Coluna
        </Button>
      </div>
    </div>
  );
}
