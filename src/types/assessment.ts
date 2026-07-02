export interface ParsedQuestion {
  id: string;
  text: string;
  choices: string[];
}

export interface AssessmentAnswerKeyEntry {
  question: string;
  correctAnswer: string;
  source: 'docs/assessments/اجابة الاختبار.docx';
  rationale: string;
}

export interface AssessmentAttempt {
  assessmentId: string;
  currentIndex: number;
  answers: Record<string, string>;
  startedAt: string;
  updatedAt: string;
  finishedAt: string | null;
}

export interface GradedQuestion {
  id: string;
  text: string;
  selectedAnswer: string | null;
  correctAnswer: string | null;
  isCorrect: boolean | null;
  rationale: string | null;
}

export interface GradingResult {
  score: number;
  gradedTotal: number;
  total: number;
  correct: number;
  wrong: number;
  percent: number;
  durationSeconds: number;
  passPercent: number;
  review: GradedQuestion[];
  ungradedQuestionIds: string[];
}
