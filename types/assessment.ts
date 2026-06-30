import type { DocumentModel } from './document.ts';

export interface AssessmentModel extends DocumentModel {
  type: 'assessment';
}
