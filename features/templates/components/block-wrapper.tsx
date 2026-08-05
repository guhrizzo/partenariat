"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";

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
        "group/block relative isolate min-h-9 rounded-md pr-3 transition-colors hover:bg-blue-50/60 dark:hover:bg-blue-950/20",
        isDragging && "z-10 opacity-60"
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute -left-9 top-1/2 flex size-7 -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-md text-foreground-muted opacity-0 transition-opacity group-hover/block:opacity-100 hover:bg-background-subtle active:cursor-grabbing"
        aria-label="Arrastar para reordenar"
      >
        <Copy className="size-4 -rotate-90" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          data-block-menu
          aria-label="Ações do bloco"
          className="absolute -right-10 top-1/2 z-10 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-foreground-muted opacity-0 transition-opacity group-hover/block:opacity-100 hover:bg-background-subtle hover:text-foreground focus-visible:opacity-100 data-[state=open]:opacity-100"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="left" className="min-w-44">
          <DropdownMenuItem onSelect={onDuplicate}>
            <Copy className="size-3.5" />
            Duplicar
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={onRemove}
            className="text-red-600 focus:text-red-700 dark:text-red-400 dark:focus:text-red-300"
          >
            <Trash2 className="size-3.5" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="px-1 py-2">{children}</div>
    </div>
  );
}
