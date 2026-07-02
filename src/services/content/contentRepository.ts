import type { DocumentModel } from '../../../types/document';
import type { ModuleModel } from '../../../types/module';
import type { AssessmentModel } from '../../../types/assessment';

const idMap: Record<string, string> = {
  'm1': 'الموديول-الأول',
  'module-1': 'الموديول-الأول',
  'm2': 'الموديول-الثاني',
  'module-2': 'الموديول-الثاني',
  'm3': 'الموديول-الثالث',
  'module-3': 'الموديول-الثالث'
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

  getAssessment(id: string): AssessmentModel | null {
    try {
      const modules = import.meta.glob('../../../generated/content/*.json', { eager: true });
      const pathMap: Record<string, string> = {
         'pre-test': 'الاختبار-التحصيلي',
         'pre-scale': 'مقياس-التقبل-التكنولوجي',
         'post-test': 'الاختبار-التحصيلي',
         'post-scale': 'مقياس-التقبل-التكنولوجي',
         'pre': 'الاختبار-التحصيلي',
         'post': 'مقياس-التقبل-التكنولوجي'
      };
      const fileName = pathMap[id];
      if (!fileName) return null;
      const path = `../../../generated/content/${fileName}.json`;
      return (modules[path] as any)?.default as AssessmentModel || null;
    } catch {
      return null;
    }
  },

  getImage(src: string): string | null {
    try {
      const images = import.meta.glob('../../../generated/images/**/*.{png,jpg,jpeg,svg,gif,webp}', { eager: true, query: '?url', import: 'default' });
      const decodedSrc = decodeURIComponent(src);
      const pathsToTry = [
        `../../../${decodedSrc}`,
        `../../../${encodeURI(decodedSrc)}`,
        `../../../${src}`,
        `../../../generated/images/${decodedSrc.split('/').pop()}`, // Fallback if directory name mismatch
      ];

      for (const p of pathsToTry) {
        if (images[p]) return images[p] as string;
      }
      
      return null;
    } catch {
      return null;
    }
  }
};
