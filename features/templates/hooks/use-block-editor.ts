"use client";

import { useCallback, useReducer } from "react";
import type { Block, BlockType } from "@/types";
import { createBlock } from "@/features/templates/lib/create-block";

type Action =
  | { type: "ADD"; block: Block; index?: number }
  | { type: "UPDATE"; block: Block }
  | { type: "REMOVE"; id: string }
  | { type: "DUPLICATE"; id: string }
  | { type: "REORDER"; blocks: Block[] };

function reducer(state: Block[], action: Action): Block[] {
  switch (action.type) {
    case "ADD": {
      const index = action.index ?? state.length;
      const next = [...state];
      next.splice(index, 0, action.block);
      return next;
    }
    case "UPDATE":
      return state.map((block) => (block.id === action.block.id ? action.block : block));
    case "REMOVE":
      return state.filter((block) => block.id !== action.id);
    case "DUPLICATE": {
      const index = state.findIndex((block) => block.id === action.id);
      if (index === -1) return state;
      const copy: Block = { ...state[index], id: crypto.randomUUID() };
      const next = [...state];
      next.splice(index + 1, 0, copy);
      return next;
    }
    case "REORDER":
      return action.blocks;
    default:
      return state;
  }
}

export function useBlockEditor(initialBlocks: Block[]) {
  const [blocks, dispatch] = useReducer(reducer, initialBlocks);

  const addBlock = useCallback((type: BlockType, index?: number) => {
    dispatch({ type: "ADD", block: createBlock(type), index });
  }, []);

  const updateBlock = useCallback((block: Block) => {
    dispatch({ type: "UPDATE", block });
  }, []);

  const removeBlock = useCallback((id: string) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  const duplicateBlock = useCallback((id: string) => {
    dispatch({ type: "DUPLICATE", id });
  }, []);

  const reorderBlocks = useCallback((next: Block[]) => {
    dispatch({ type: "REORDER", blocks: next });
  }, []);

  return { blocks, addBlock, updateBlock, removeBlock, duplicateBlock, reorderBlocks };
}
