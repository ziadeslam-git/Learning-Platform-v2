import type { LearningProgressState } from '../types/progress';
import { readJson, writeJson } from './storage/localStorageClient';

const key = 'learning-platform:progress:v1';

export const defaultProgressState: LearningProgressState = {
  lastModuleId: null,
  lastAssessmentId: null,
  modules: {},
  completedAssessments: {},
  learningStartedAt: null,
  lastVisitedAt: null,
  totalLearningSeconds: 0,
};

export const progressStorage = {
  load() {
    return readJson<LearningProgressState>(key, defaultProgressState);
  },
  save(state: LearningProgressState) {
    writeJson(key, state);
  },
};
