import { contentRepository } from '../content/contentRepository';
import type { RetrievalDocument } from '../../features/assistant/types';
import type { Block, UnknownBlock, TableBlock } from '../../../types/blocks';
import type { Section, DocumentModel } from '../../../types/document';

const MODULE_IDS = ['m1', 'm2', 'm3'];

function normalizeText(text: string): string {
  if (!text) return '';
  // 1. Strip HTML tags
  let normalized = text.replace(/<[^>]*>?/gm, ' ');
  // 2. Replace non-breaking spaces & other weird spaces with standard space
  normalized = normalized.replace(/&nbsp;|&#160;/gi, ' ');
  // 3. Replace multiple spaces and newlines with a single space
  normalized = normalized.replace(/\s+/g, ' ');
  return normalized.trim();
}

function processUnknownBlock(block: UnknownBlock): string {
  if (!block.rawHtml) return '';
  const normalized = normalizeText(block.rawHtml);
  return normalized;
}

function processTableBlock(block: TableBlock): string {
  if (!block.rows || !Array.isArray(block.rows)) return '';
  // Join all cells with a space or comma to make them searchable
  const tableContent = block.rows.map(row => row.join(' | ')).join(' - ');
  return normalizeText(tableContent);
}

export function generateIndex(): RetrievalDocument[] {
  const documents: RetrievalDocument[] = [];

  // Function to process a document and its sections
  const processDocument = (doc: DocumentModel) => {
    const moduleId = doc.id;
    const moduleTitle = doc.title;

    // Index the module title itself if useful
    documents.push({
      id: `${moduleId}_title`,
      moduleId,
      moduleTitle,
      lessonId: moduleId,
      lessonTitle: moduleTitle,
      content: normalizeText(moduleTitle),
      contentType: 'module'
    });

    doc.sections.forEach((section: Section, sIndex: number) => {
      let currentSectionTitle = section.title || `Section ${sIndex + 1}`;
      
      // Index the lesson/section title
      documents.push({
        id: `${moduleId}_s${sIndex}_title`,
        moduleId,
        moduleTitle,
        lessonId: section.id,
        lessonTitle: currentSectionTitle,
        content: normalizeText(currentSectionTitle),
        contentType: 'lesson'
      });

      let lastHeading = '';

      section.blocks.forEach((block: Block, bIndex: number) => {
        const docId = `${moduleId}_s${sIndex}_b${bIndex}`;

        if (block.type === 'HeadingBlock') {
          lastHeading = normalizeText(block.content);
          documents.push({
            id: docId,
            moduleId,
            moduleTitle,
            lessonId: section.id,
            lessonTitle: currentSectionTitle,
            sectionTitle: lastHeading,
            content: lastHeading,
            contentType: 'concept'
          });
        } 
        else if (block.type === 'ParagraphBlock') {
          const content = normalizeText(block.content);
          if (content.length > 5) {
            documents.push({
              id: docId,
              moduleId,
              moduleTitle,
              lessonId: section.id,
              lessonTitle: currentSectionTitle,
              sectionTitle: lastHeading,
              content,
              contentType: 'paragraph'
            });
          }
        } 
        else if (block.type === 'UnknownBlock') {
          const content = processUnknownBlock(block);
          // If it looks like a list or just generic text
          if (content.length > 5) {
            documents.push({
              id: docId,
              moduleId,
              moduleTitle,
              lessonId: section.id,
              lessonTitle: currentSectionTitle,
              sectionTitle: lastHeading,
              content,
              contentType: 'list' // Simplification
            });
          }
        } 
        else if (block.type === 'TableBlock') {
          const content = processTableBlock(block);
          if (content.length > 5) {
            documents.push({
              id: docId,
              moduleId,
              moduleTitle,
              lessonId: section.id,
              lessonTitle: currentSectionTitle,
              sectionTitle: lastHeading,
              content,
              contentType: 'table'
            });
          }
        }
        // Exclude QuestionBlock, ChoiceBlock, AnswerBlock, ImageBlock
      });
    });
  };

  // 1. Index Modules
  MODULE_IDS.forEach(id => {
    const mod = contentRepository.getModule(id);
    if (mod) {
      processDocument(mod);
    }
  });

  // 2. Index Platform Objectives/Goals (if any)
  const platform = contentRepository.getPlatform();
  if (platform) {
    processDocument(platform);
  }

  return documents;
}

// Singleton pattern for caching the index in-memory
let cachedIndex: RetrievalDocument[] | null = null;

export function getRetrievalIndex(): RetrievalDocument[] {
  if (!cachedIndex) {
    cachedIndex = generateIndex();
  }
  return cachedIndex;
}
