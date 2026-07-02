import { achievementAnswerKey } from '../../../data/assessments/achievementAnswerKey';
import type { AssessmentAttempt, GradingResult, ParsedQuestion } from '../../../types/assessment';

function normalize(value: string) {
  return value.replace(/[.،:؟\s]+$/g, '').trim();
}

export function gradeAssessment(assessmentId: string, questions: ParsedQuestion[], attempt: AssessmentAttempt): GradingResult {
  const startedAt = new Date(attempt.startedAt).getTime();
  const finishedAt = new Date(attempt.finishedAt ?? attempt.updatedAt).getTime();
  const answerKey = assessmentId.includes('test') || assessmentId === 'pre' || assessmentId === 'post'
    ? achievementAnswerKey
    : [];

  const review = questions.map((question) => {
    const key = answerKey.find((entry) => normalize(entry.question) === normalize(question.text));
    const selectedAnswer = attempt.answers[question.id] ?? null;
    const correctAnswer = key?.correctAnswer ?? null;
    const isCorrect = correctAnswer ? normalize(selectedAnswer ?? '') === normalize(correctAnswer) : null;

    return {
      id: question.id,
      text: question.text,
      selectedAnswer,
      correctAnswer,
      isCorrect,
      rationale: key?.rationale ?? null,
    };
  });

  const graded = review.filter((item) => item.correctAnswer);
  const correct = graded.filter((item) => item.isCorrect).length;
  const wrong = graded.length - correct;

  return {
    score: correct,
    gradedTotal: graded.length,
    total: questions.length,
    correct,
    wrong,
    percent: graded.length ? Math.round((correct / graded.length) * 100) : 0,
    durationSeconds: Math.max(0, Math.round((finishedAt - startedAt) / 1000)),
    passPercent: 60,
    review,
    ungradedQuestionIds: review.filter((item) => !item.correctAnswer).map((item) => item.id),
  };
}
