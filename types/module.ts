import type { DocumentModel } from './document.ts';

export interface ModuleModel extends DocumentModel {
  type: 'module';
  // Add module specific metadata here if needed later
}
