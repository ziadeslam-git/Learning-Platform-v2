import React from 'react';
import type { Block } from '../../../../types/blocks';
import { ParagraphBlockRenderer } from './blocks/ParagraphBlockRenderer';
import { HeadingBlockRenderer } from './blocks/HeadingBlockRenderer';
import { ImageBlockRenderer } from './blocks/ImageBlockRenderer';
import { TableBlockRenderer } from './blocks/TableBlockRenderer';

interface BlockRendererProps {
  block: Block;
}

export const BlockRenderer: React.FC<BlockRendererProps> = React.memo(({ block }) => {
  switch (block.type) {
    case 'ParagraphBlock':
      return <ParagraphBlockRenderer block={block} />;
    case 'HeadingBlock':
      return <HeadingBlockRenderer block={block} />;
    case 'ImageBlock':
      return <ImageBlockRenderer block={block} />;
    case 'TableBlock':
      return <TableBlockRenderer block={block} />;
    
    // Assessment blocks will be handled by the AssessmentEngine later,
    // but if they appear here, fallback to paragraph to avoid crashing.
    case 'QuestionBlock':
    case 'ChoiceBlock':
    case 'AnswerBlock':
    case 'UnknownBlock':
    default:
      // Graceful fallback
      return <ParagraphBlockRenderer block={{ ...block, type: 'ParagraphBlock' }} />;
  }
});
