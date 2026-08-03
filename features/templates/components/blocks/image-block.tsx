"use client";

import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ImageOff, Loader2, Upload } from "lucide-react";
import { storage } from "@/firebase/client";
import { Input } from "@/design-system/components/input";
import type { ImageBlock } from "@/types";

interface ImageBlockProps {
  block: ImageBlock;
  organizationId: string;
  templateId: string;
  onChange: (block: ImageBlock) => void;
}

export function ImageBlockComponent({ block, organizationId, templateId, onChange }: ImageBlockProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    try {
      const path = `organizations/${organizationId}/templates/${templateId}/assets/${crypto.randomUUID()}-${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onChange({ ...block, url, alt: block.alt || file.name });
    } catch {
      setError("Não foi possível enviar a imagem.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {block.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={block.url}
          alt={block.alt}
          style={block.width ? { width: block.width } : undefined}
          className="max-w-full rounded-md border border-border"
        />
      ) : (
        <div className="flex h-32 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-foreground-muted">
          <ImageOff className="size-5" />
          <span className="text-xs">Nenhuma imagem selecionada</span>
        </div>
      )}

      <div className="hidden flex-wrap items-center gap-2 group-hover/block:flex">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-background-subtle">
          {isUploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
          {isUploading ? "Enviando..." : "Enviar imagem"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
        <Input
          placeholder="Texto alternativo"
          value={block.alt}
          onChange={(event) => onChange({ ...block, alt: event.target.value })}
          className="h-8 max-w-40 text-xs"
        />
        <Input
          type="number"
          placeholder="Largura (px)"
          value={block.width ?? ""}
          onChange={(event) =>
            onChange({ ...block, width: event.target.value ? Number(event.target.value) : null })
          }
          className="h-8 max-w-28 text-xs"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
