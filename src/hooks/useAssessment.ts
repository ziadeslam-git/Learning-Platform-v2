import { useAssessmentStore } from '../stores/assessment.store';

export function useAssessment(assessmentId: string) {
  const attempt = useAssessmentStore((state) => state.attempts[assessmentId]);
  const startAttempt = useAssessmentStore((state) => state.startAttempt);
  const setAnswer = useAssessmentStore((state) => state.setAnswer);
  const setCurrentIndex = useAssessmentStore((state) => state.setCurrentIndex);
  const finishAttempt = useAssessmentStore((state) => state.finishAttempt);
  const resetAttempt = useAssessmentStore((state) => state.resetAttempt);

  return {
    attempt,
    startAttempt,
    setAnswer,
    setCurrentIndex,
    finishAttempt,
    resetAttempt,
  };
}
