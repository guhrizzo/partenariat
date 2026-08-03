"use client";

import { LayoutTemplate } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { EmptyState } from "@/design-system/components/empty-state";
import { AddBlockMenu } from "@/features/templates/components/add-block-menu";
import { BlockWrapper } from "@/features/templates/components/block-wrapper";
import { DocumentPage } from "@/features/templates/components/document-page";
import {
  DateBlockComponent,
  DividerBlockComponent,
  DynamicFieldBlockComponent,
  FooterBlockComponent,
  HeadingBlockComponent,
  ImageBlockComponent,
  ListBlockComponent,
  PageBreakBlockComponent,
  ParagraphBlockComponent,
  QrCodeBlockComponent,
  SignatureBlockComponent,
  SpacerBlockComponent,
  SubheadingBlockComponent,
  TableBlockComponent,
} from "@/features/templates/components/blocks";
import type { Block, BlockType, FieldDefinition } from "@/types";

interface BlockCanvasProps {
  blocks: Block[];
  organizationId: string;
  templateId: string;
  availableFields: FieldDefinition[];
  onAddBlock: (type: BlockType, index?: number) => void;
  onUpdateBlock: (block: Block) => void;
  onRemoveBlock: (id: string) => void;
  onDuplicateBlock: (id: string) => void;
  onReorderBlocks: (blocks: Block[]) => void;
  onFieldCreated: (field: FieldDefinition) => void;
}

export function BlockCanvas({
  blocks,
  organizationId,
  templateId,
  availableFields,
  onAddBlock,
  onUpdateBlock,
  onRemoveBlock,
  onDuplicateBlock,
  onReorderBlocks,
  onFieldCreated,
}: BlockCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((block) => block.id === active.id);
    const newIndex = blocks.findIndex((block) => block.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorderBlocks(arrayMove(blocks, oldIndex, newIndex));
  }

  function renderBlock(block: Block) {
    switch (block.type) {
      case "heading":
        return <HeadingBlockComponent block={block} onChange={onUpdateBlock} />;
      case "subheading":
        return <SubheadingBlockComponent block={block} onChange={onUpdateBlock} />;
      case "paragraph":
        return <ParagraphBlockComponent block={block} onChange={onUpdateBlock} />;
      case "list":
        return <ListBlockComponent block={block} onChange={onUpdateBlock} />;
      case "table":
        return <TableBlockComponent block={block} onChange={onUpdateBlock} />;
      case "image":
        return (
          <ImageBlockComponent
            block={block}
            organizationId={organizationId}
            templateId={templateId}
            onChange={onUpdateBlock}
          />
        );
      case "divider":
        return <DividerBlockComponent />;
      case "spacer":
        return <SpacerBlockComponent block={block} onChange={onUpdateBlock} />;
      case "dynamicField":
        return (
          <DynamicFieldBlockComponent
            block={block}
            availableFields={availableFields}
            onChange={onUpdateBlock}
            onFieldCreated={onFieldCreated}
          />
        );
      case "signature":
        return <SignatureBlockComponent block={block} onChange={onUpdateBlock} />;
      case "date":
        return <DateBlockComponent block={block} onChange={onUpdateBlock} />;
      case "qrCode":
        return <QrCodeBlockComponent />;
      case "footer":
        return <FooterBlockComponent block={block} onChange={onUpdateBlock} />;
      case "pageBreak":
        return <PageBreakBlockComponent />;
      default:
        return null;
    }
  }

  return (
    <div className="light">
      <DocumentPage>
        {blocks.length === 0 ? (
          <EmptyState
            icon={LayoutTemplate}
            title="Modelo vazio"
            description="Adicione o primeiro bloco para começar a montar o contrato."
            action={<AddBlockMenu onSelect={(type) => onAddBlock(type)} />}
          />
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={blocks.map((block) => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {blocks.map((block) => (
                  <BlockWrapper
                    key={block.id}
                    id={block.id}
                    onDuplicate={() => onDuplicateBlock(block.id)}
                    onRemove={() => onRemoveBlock(block.id)}
                  >
                    {renderBlock(block)}
                  </BlockWrapper>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {blocks.length > 0 && (
          <div className="pt-2">
            <AddBlockMenu onSelect={(type) => onAddBlock(type)} label="Adicionar bloco" />
          </div>
        )}
      </DocumentPage>
    </div>
  );
}
