"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/design-system/components/button";
import { cn } from "@/shared/utils/cn";

interface BlockWrapperProps {
  id: string;
  onDuplicate: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}

export function BlockWrapper({ id, onDuplicate, onRemove, children }: BlockWrapperProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group/block relative -mx-2 rounded-md px-2 py-1 hover:bg-blue-50/60 dark:hover:bg-blue-950/20",
        isDragging && "z-10 opacity-60"
      )}
    >
      <div className="absolute -left-9 top-1 hidden items-center group-hover/block:flex">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none rounded p-1 text-foreground-muted hover:bg-background-subtle active:cursor-grabbing"
          aria-label="Arrastar para reordenar"
        >
          <GripVertical className="size-4" />
        </button>
      </div>

      <div className="absolute -right-1 top-1 hidden translate-x-full items-center gap-0.5 rounded-md border border-border bg-card p-0.5 shadow-sm group-hover/block:flex">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onDuplicate}
          aria-label="Duplicar bloco"
        >
          <Copy className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-red-600 hover:text-red-700"
          onClick={onRemove}
          aria-label="Remover bloco"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      {children}
    </div>
  );
}
