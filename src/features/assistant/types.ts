export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: RetrievalDocument[];
}

export interface RetrievalDocument {
  id: string;
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  sectionTitle?: string;
  conceptId?: string;
  content: string;
  contentType:
    | 'module'
    | 'lesson'
    | 'concept'
    | 'paragraph'
    | 'list'
    | 'table'
    | 'summary'
    | 'objective';
}

export interface RetrievalResult {
  document: RetrievalDocument;
  score: number;
  matchedTerms?: string[];
}

export interface RetrievalOptions {
  limit?: number;
}
