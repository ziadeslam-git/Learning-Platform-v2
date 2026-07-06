import { create } from 'zustand';
import { learningPath } from '../data/learningPath';
import { defaultProgressState, progressStorage } from '../services/progressStorage';
import type { LearningProgressState, LearningStats, ModuleProgress } from '../types/progress';

function now() {
  return new Date().toISOString();
}

function createModuleProgress(moduleId: string): ModuleProgress {
  return {
    moduleId,
    openedSectionIds: [],
    activeSectionId: null,
    activeAccordionId: null,
    checklist: {},
    quizAnswers: {},
    completedQuizzes: {},
    completedSections: {},
    percent: 0,
    lastVisitedAt: now(),
  };
}

function persist(state: ProgressStore) {
  progressStorage.save({
    lastModuleId: state.lastModuleId,
    lastAssessmentId: state.lastAssessmentId,
    modules: state.modules,
    completedAssessments: state.completedAssessments,
    learningStartedAt: state.learningStartedAt,
    lastVisitedAt: state.lastVisitedAt,
    totalLearningSeconds: state.totalLearningSeconds,
  });
}

interface ProgressStore extends LearningProgressState {
  touch: () => void;
  visitModule: (moduleId: string) => void;
  visitAssessment: (assessmentId: string) => void;
  setActiveAccordion: (moduleId: string, accordionId: string | null) => void;
  setSectionCompleted: (moduleId: string, sectionId: string, totalSections: number) => void;
  setChecklistItem: (moduleId: string, itemId: string, checked: boolean) => void;
  setQuizAnswer: (moduleId: string, questionId: string, answer: string) => void;
  markQuizCompleted: (moduleId: string, quizId: string) => void;
  completeModule: (moduleId: string) => void;
  markAssessmentCompleted: (assessmentId: string) => void;
  addLearningSeconds: (seconds: number) => void;
  getStats: () => LearningStats;
}

const initial = progressStorage.load();

export const useProgressStore = create<ProgressStore>((set, get) => ({
  ...defaultProgressState,
  ...initial,

  touch: () => set((state) => {
    const next = {
      ...state,
      learningStartedAt: state.learningStartedAt ?? now(),
      lastVisitedAt: now(),
    };
    persist(next);
    return next;
  }),

  visitModule: (moduleId) => set((state) => {
    const existing = state.modules[moduleId] ?? createModuleProgress(moduleId);
    const next = {
      ...state,
      lastModuleId: moduleId,
      learningStartedAt: state.learningStartedAt ?? now(),
      lastVisitedAt: now(),
      modules: {
        ...state.modules,
        [moduleId]: { ...existing, lastVisitedAt: now() },
      },
    };
    persist(next);
    return next;
  }),

  visitAssessment: (assessmentId) => set((state) => {
    const next = {
      ...state,
      lastAssessmentId: assessmentId,
      learningStartedAt: state.learningStartedAt ?? now(),
      lastVisitedAt: now(),
    };
    persist(next);
    return next;
  }),

  setActiveAccordion: (moduleId, accordionId) => set((state) => {
    const moduleProgress = state.modules[moduleId] ?? createModuleProgress(moduleId);
    const currentOpenedSectionIds = moduleProgress.openedSectionIds ?? [];
    const openedSectionIds = accordionId && !currentOpenedSectionIds.includes(accordionId)
      ? [...currentOpenedSectionIds, accordionId]
      : currentOpenedSectionIds;
    const next = {
      ...state,
      lastModuleId: moduleId,
      lastVisitedAt: now(),
      modules: {
        ...state.modules,
        [moduleId]: {
          ...moduleProgress,
          activeAccordionId: accordionId,
          activeSectionId: accordionId,
          openedSectionIds,
          lastVisitedAt: now(),
        },
      },
    };
    persist(next);
    return next;
  }),

  setSectionCompleted: (moduleId, sectionId, totalSections) => set((state) => {
    const moduleProgress = state.modules[moduleId] ?? createModuleProgress(moduleId);
    const completedSections = { ...(moduleProgress.completedSections ?? {}), [sectionId]: true };
    const percent = totalSections > 0
      ? Math.min(100, Math.round((Object.keys(completedSections).length / totalSections) * 100))
      : moduleProgress.percent;
    const next = {
      ...state,
      lastModuleId: moduleId,
      lastVisitedAt: now(),
      modules: {
        ...state.modules,
        [moduleId]: { ...moduleProgress, completedSections, percent, lastVisitedAt: now() },
      },
    };
    persist(next);
    return next;
  }),

  setChecklistItem: (moduleId, itemId, checked) => set((state) => {
    const moduleProgress = state.modules[moduleId] ?? createModuleProgress(moduleId);
    const next = {
      ...state,
      lastVisitedAt: now(),
      modules: {
        ...state.modules,
        [moduleId]: {
          ...moduleProgress,
          checklist: { ...(moduleProgress.checklist ?? {}), [itemId]: checked },
          lastVisitedAt: now(),
        },
      },
    };
    persist(next);
    return next;
  }),

  setQuizAnswer: (moduleId, questionId, answer) => set((state) => {
    const moduleProgress = state.modules[moduleId] ?? createModuleProgress(moduleId);
    const next = {
      ...state,
      lastModuleId: moduleId,
      lastVisitedAt: now(),
      modules: {
        ...state.modules,
        [moduleId]: {
          ...moduleProgress,
          quizAnswers: { ...(moduleProgress.quizAnswers ?? {}), [questionId]: answer },
          lastVisitedAt: now(),
        },
      },
    };
    persist(next);
    return next;
  }),

  markQuizCompleted: (moduleId, quizId) => set((state) => {
    const moduleProgress = state.modules[moduleId] ?? createModuleProgress(moduleId);
    const next = {
      ...state,
      lastModuleId: moduleId,
      lastVisitedAt: now(),
      modules: {
        ...state.modules,
        [moduleId]: {
          ...moduleProgress,
          completedQuizzes: { ...(moduleProgress.completedQuizzes ?? {}), [quizId]: true },
          lastVisitedAt: now(),
        },
      },
    };
    persist(next);
    return next;
  }),

  completeModule: (moduleId) => set((state) => {
    const moduleProgress = state.modules[moduleId] ?? createModuleProgress(moduleId);
    const next = {
      ...state,
      lastModuleId: moduleId,
      lastVisitedAt: now(),
      modules: {
        ...state.modules,
        [moduleId]: { ...moduleProgress, percent: 100, lastVisitedAt: now() },
      },
    };
    persist(next);
    return next;
  }),

  markAssessmentCompleted: (assessmentId) => set((state) => {
    const next = {
      ...state,
      completedAssessments: { ...state.completedAssessments, [assessmentId]: true },
      lastVisitedAt: now(),
    };
    persist(next);
    return next;
  }),

  addLearningSeconds: (seconds) => set((state) => {
    const next = {
      ...state,
      learningStartedAt: state.learningStartedAt ?? now(),
      lastVisitedAt: now(),
      totalLearningSeconds: state.totalLearningSeconds + seconds,
    };
    persist(next);
    return next;
  }),

  getStats: () => {
    const state = get();
    const moduleCount = learningPath.filter((node) => node.type === 'module').length;
    const assessmentCount = learningPath.filter((node) => node.type === 'assessment').length;
    return {
      moduleCount,
      completedModuleCount: Object.values(state.modules).filter((module) => module.percent >= 100).length,
      assessmentCount,
      completedAssessmentCount: Object.values(state.completedAssessments).filter(Boolean).length,
      totalLearningSeconds: state.totalLearningSeconds,
      lastVisitedAt: state.lastVisitedAt,
    };
  },
}));
