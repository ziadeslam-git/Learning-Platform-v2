import { create } from 'zustand';
import { assessmentStorage } from '../services/assessmentStorage';
import type { AssessmentAttempt } from '../types/assessment';

function now() {
  return new Date().toISOString();
}

interface AssessmentStore {
  attempts: Record<string, AssessmentAttempt>;
  startAttempt: (assessmentId: string) => AssessmentAttempt;
  setAnswer: (assessmentId: string, questionId: string, answer: string) => void;
  setCurrentIndex: (assessmentId: string, currentIndex: number) => void;
  finishAttempt: (assessmentId: string) => void;
  resetAttempt: (assessmentId: string) => void;
}

function persist(attempts: Record<string, AssessmentAttempt>) {
  assessmentStorage.save(attempts);
}

export const useAssessmentStore = create<AssessmentStore>((set, get) => ({
  attempts: assessmentStorage.load(),

  startAttempt: (assessmentId) => {
    const existing = get().attempts[assessmentId];
    if (existing) return existing;

    const attempt: AssessmentAttempt = {
      assessmentId,
      currentIndex: 0,
      answers: {},
      startedAt: now(),
      updatedAt: now(),
      finishedAt: null,
    };
    const attempts = { ...get().attempts, [assessmentId]: attempt };
    persist(attempts);
    set({ attempts });
    return attempt;
  },

  setAnswer: (assessmentId, questionId, answer) => set((state) => {
    const attempt = state.attempts[assessmentId] ?? {
      assessmentId,
      currentIndex: 0,
      answers: {},
      startedAt: now(),
      updatedAt: now(),
      finishedAt: null,
    };
    const attempts = {
      ...state.attempts,
      [assessmentId]: {
        ...attempt,
        answers: { ...attempt.answers, [questionId]: answer },
        updatedAt: now(),
      },
    };
    persist(attempts);
    return { attempts };
  }),

  setCurrentIndex: (assessmentId, currentIndex) => set((state) => {
    const attempt = state.attempts[assessmentId];
    if (!attempt) return state;
    const attempts = {
      ...state.attempts,
      [assessmentId]: { ...attempt, currentIndex, updatedAt: now() },
    };
    persist(attempts);
    return { attempts };
  }),

  finishAttempt: (assessmentId) => set((state) => {
    const attempt = state.attempts[assessmentId];
    if (!attempt) return state;
    const attempts = {
      ...state.attempts,
      [assessmentId]: { ...attempt, finishedAt: now(), updatedAt: now() },
    };
    persist(attempts);
    return { attempts };
  }),

  resetAttempt: (assessmentId) => set((state) => {
    const attempts = { ...state.attempts };
    delete attempts[assessmentId];
    persist(attempts);
    return { attempts };
  }),
}));
