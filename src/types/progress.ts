export type LearningItemStatus = 'completed' | 'active' | 'not-started';

export interface ModuleProgress {
  moduleId: string;
  openedSectionIds: string[];
  activeSectionId: string | null;
  activeAccordionId: string | null;
  checklist: Record<string, boolean>;
  completedSections: Record<string, boolean>;
  percent: number;
  lastVisitedAt: string;
}

export interface LearningProgressState {
  lastModuleId: string | null;
  lastAssessmentId: string | null;
  modules: Record<string, ModuleProgress>;
  completedAssessments: Record<string, boolean>;
  learningStartedAt: string | null;
  lastVisitedAt: string | null;
  totalLearningSeconds: number;
}

export interface LearningStats {
  moduleCount: number;
  completedModuleCount: number;
  assessmentCount: number;
  completedAssessmentCount: number;
  totalLearningSeconds: number;
  lastVisitedAt: string | null;
}
