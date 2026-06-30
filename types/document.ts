import type { Block } from './blocks.ts';

export type DocumentType = 'module' | 'assessment' | 'platform' | 'reference';

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

export interface DocumentModel {
  id: string;
  title: string;
  type: DocumentType;
  language: 'ar' | 'en';
  sections: Section[];
}
