export type LearningItemStatus = 'completed' | 'active' | 'not-started';

export type ActivityStatus = 'idle' | 'in-progress' | 'correct' | 'failed' | 'remediation-required' | 'remediation-completed';

/** Tracks the user's position inside the sequential learning journey for a module */
export interface JourneyState {
  currentLessonIndex: number;
  currentStepIndex: number;
  completedSteps: string[];                            // step IDs that are done
  activityResults: Record<string, 'correct' | 'incorrect'>;  // stepId → result
  activityStates?: Record<string, ActivityStatus>;           // stepId → granular state
}

export interface ModuleProgress {
  moduleId: string;
  quizAnswers: Record<string, string>;
  completedQuizzes: Record<string, boolean>;
  completedSections: Record<string, boolean>;
  percent: number;
  lastVisitedAt: string;
  journeyState?: JourneyState;
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
