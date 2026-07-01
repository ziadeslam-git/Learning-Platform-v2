import type { DocumentModel } from '../../../types/document';
import type { ModuleModel } from '../../../types/module';
import type { AssessmentModel } from '../../../types/assessment';

const idMap: Record<string, string> = {
  'm1': 'الموديول-الأول',
  'm2': 'الموديول-الثاني',
  'm3': 'الموديول-الثالث'
};

export const contentRepository = {
  getModule(id: string): ModuleModel | null {
    try {
      const modules = import.meta.glob('../../../generated/content/*.json', { eager: true });
      const mappedId = idMap[id] || id;
      const path = `../../../generated/content/${mappedId}.json`;
      return (modules[path] as any)?.default as ModuleModel || null;
    } catch {
      return null;
    }
  },

  getPlatform(): DocumentModel | null {
    try {
      const modules = import.meta.glob('../../../generated/content/*.json', { eager: true });
      const path = `../../../generated/content/قائمة-الاهداف.json`;
      return (modules[path] as any)?.default as DocumentModel || null;
    } catch {
      return null;
    }
  },

  getPreAssessment(): AssessmentModel | null {
    try {
      const modules = import.meta.glob('../../../generated/content/*.json', { eager: true });
      const path = `../../../generated/content/الاختبار-التحصيلي.json`;
      return (modules[path] as any)?.default as AssessmentModel || null;
    } catch {
      return null;
    }
  },

  getPostAssessment(): AssessmentModel | null {
    try {
      const modules = import.meta.glob('../../../generated/content/*.json', { eager: true });
      const path = `../../../generated/content/مقياس-التقبل-التكنولوجي.json`;
      return (modules[path] as any)?.default as AssessmentModel || null;
    } catch {
      return null;
    }
  }
};
