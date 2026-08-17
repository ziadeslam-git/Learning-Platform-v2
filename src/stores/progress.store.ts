import { create } from 'zustand';
import { learningPath } from '../data/learningPath';
import { defaultProgressState, progressStorage } from '../services/progressStorage';
import type { JourneyState, LearningProgressState, LearningStats, ModuleProgress, ActivityStatus } from '../types/progress';

function now() {
  return new Date().toISOString();
}

function createModuleProgress(moduleId: string): ModuleProgress {
  return {
    moduleId,
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
  setSectionCompleted: (moduleId: string, sectionId: string, totalSections: number) => void;
  setQuizAnswer: (moduleId: string, questionId: string, answer: string) => void;
  markQuizCompleted: (moduleId: string, quizId: string) => void;
  completeModule: (moduleId: string) => void;
  markAssessmentCompleted: (assessmentId: string) => void;
  addLearningSeconds: (seconds: number) => void;
  getStats: () => LearningStats;
  resetAll: () => void;
  // Journey actions
  setJourneyStep: (moduleId: string, lessonIndex: number, stepIndex: number) => void;
  markStepCompleted: (moduleId: string, stepId: string) => void;
  recordActivityResult: (moduleId: string, stepId: string, result: 'correct' | 'incorrect') => void;
  setActivityState: (moduleId: string, stepId: string, state: ActivityStatus) => void;
}

const initial = progressStorage.load();

export const useProgressStore = create<ProgressStore>((set, get) => ({
  ...defaultProgressState,
  ...initial,

  resetAll: () => {
    progressStorage.clear();
    set(defaultProgressState);
  },

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

  setJourneyStep: (moduleId, lessonIndex, stepIndex) => set((state) => {
    const moduleProgress = state.modules[moduleId] ?? createModuleProgress(moduleId);
    const prevJourney: JourneyState = moduleProgress.journeyState ?? {
      currentLessonIndex: 0,
      currentStepIndex: 0,
      completedSteps: [],
      activityResults: {},
    };
    const next = {
      ...state,
      lastModuleId: moduleId,
      lastVisitedAt: now(),
      modules: {
        ...state.modules,
        [moduleId]: {
          ...moduleProgress,
          journeyState: { ...prevJourney, currentLessonIndex: lessonIndex, currentStepIndex: stepIndex },
          lastVisitedAt: now(),
        },
      },
    };
    persist(next);
    return next;
  }),

  markStepCompleted: (moduleId, stepId) => set((state) => {
    const moduleProgress = state.modules[moduleId] ?? createModuleProgress(moduleId);
    const prevJourney: JourneyState = moduleProgress.journeyState ?? {
      currentLessonIndex: 0,
      currentStepIndex: 0,
      completedSteps: [],
      activityResults: {},
    };
    const completedSteps = prevJourney.completedSteps.includes(stepId)
      ? prevJourney.completedSteps
      : [...prevJourney.completedSteps, stepId];
    const next = {
      ...state,
      lastModuleId: moduleId,
      lastVisitedAt: now(),
      modules: {
        ...state.modules,
        [moduleId]: {
          ...moduleProgress,
          journeyState: { ...prevJourney, completedSteps },
          lastVisitedAt: now(),
        },
      },
    };
    persist(next);
    return next;
  }),

  recordActivityResult: (moduleId, stepId, result) => set((state) => {
    const moduleProgress = state.modules[moduleId] ?? createModuleProgress(moduleId);
    const prevJourney: JourneyState = moduleProgress.journeyState ?? {
      currentLessonIndex: 0,
      currentStepIndex: 0,
      completedSteps: [],
      activityResults: {},
      activityStates: {},
    };
    const next = {
      ...state,
      lastModuleId: moduleId,
      lastVisitedAt: now(),
      modules: {
        ...state.modules,
        [moduleId]: {
          ...moduleProgress,
          journeyState: {
            ...prevJourney,
            activityResults: { ...prevJourney.activityResults, [stepId]: result },
          },
          lastVisitedAt: now(),
        },
      },
    };
    persist(next);
    return next;
  }),

  setActivityState: (moduleId, stepId, activityState) => set((state) => {
    const moduleProgress = state.modules[moduleId] ?? createModuleProgress(moduleId);
    const prevJourney: JourneyState = moduleProgress.journeyState ?? {
      currentLessonIndex: 0,
      currentStepIndex: 0,
      completedSteps: [],
      activityResults: {},
      activityStates: {},
    };
    const next = {
      ...state,
      modules: {
        ...state.modules,
        [moduleId]: {
          ...moduleProgress,
          journeyState: {
            ...prevJourney,
            activityStates: { ...(prevJourney.activityStates ?? {}), [stepId]: activityState },
          },
        },
      },
    };
    persist(next);
    return next;
  }),
}));
