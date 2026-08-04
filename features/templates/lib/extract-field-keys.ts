import type { Block } from "@/types";

export function extractFieldKeys(blocks: Block[]): string[] {
  const keys = new Set<string>();
  for (const block of blocks) {
    if (block.type === "dynamicField") {
      keys.add(block.fieldKey);
    }
  }
  return Array.from(keys);
}
