export type BlockType = 
  | 'HeadingBlock' 
  | 'ParagraphBlock' 
  | 'QuestionBlock' 
  | 'ChoiceBlock' 
  | 'AnswerBlock' 
  | 'ImageBlock' 
  | 'TableBlock' 
  | 'UnknownBlock';

export interface BaseBlock {
  id: string;
  type: BlockType;
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: 'HeadingBlock';
  level: number;
}

export interface ParagraphBlock extends BaseBlock {
  type: 'ParagraphBlock';
}

export interface QuestionBlock extends BaseBlock {
  type: 'QuestionBlock';
}

export interface ChoiceBlock extends BaseBlock {
  type: 'ChoiceBlock';
  isCorrect?: boolean;
}

export interface AnswerBlock extends BaseBlock {
  type: 'AnswerBlock';
}

export interface ImageBlock extends BaseBlock {
  type: 'ImageBlock';
  src: string;
}

export interface TableBlock extends BaseBlock {
  type: 'TableBlock';
  // simple array of rows for now
  rows: string[][];
}

export interface UnknownBlock extends BaseBlock {
  type: 'UnknownBlock';
  rawHtml?: string;
}

export type Block = 
  | HeadingBlock 
  | ParagraphBlock 
  | QuestionBlock 
  | ChoiceBlock 
  | AnswerBlock 
  | ImageBlock 
  | TableBlock 
  | UnknownBlock;
