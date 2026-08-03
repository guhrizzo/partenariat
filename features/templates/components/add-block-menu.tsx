"use client";

import { Plus } from "lucide-react";
import { Button } from "@/design-system/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";
import { BLOCK_CATALOG } from "@/features/templates/constants/block-catalog";
import type { BlockType } from "@/types";

interface AddBlockMenuProps {
  onSelect: (type: BlockType) => void;
  label?: string;
}

export function AddBlockMenu({ onSelect, label = "Adicionar bloco" }: AddBlockMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Plus className="size-3.5" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
        {BLOCK_CATALOG.map(({ type, label: blockLabel, icon: Icon }) => (
          <DropdownMenuItem key={type} onSelect={() => onSelect(type)}>
            <Icon className="size-4 text-foreground-muted" />
            {blockLabel}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
