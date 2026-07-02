import type { AssessmentAttempt } from '../types/assessment';
import { readJson, writeJson, removeItem } from './storage/localStorageClient';

const key = 'learning-platform:assessments:v1';

export type AssessmentStorageState = Record<string, AssessmentAttempt>;

export const assessmentStorage = {
  load() {
    return readJson<AssessmentStorageState>(key, {});
  },
  save(state: AssessmentStorageState) {
    writeJson(key, state);
  },
  clear() {
    removeItem(key);
  },
};
