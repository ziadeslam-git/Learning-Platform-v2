import { achievementAnswerKey } from '../../../data/assessments/achievementAnswerKey';
import type { AssessmentAttempt, GradingResult, ParsedQuestion } from '../../../types/assessment';
import { scalePoints, reversedScalePoints, reversedScaleQuestions } from './scaleConfig';

function normalize(value: string) {
  return value.replace(/[.،:؟\s]+$/g, '').trim();
}

export function gradeAssessment(assessmentId: string, questions: ParsedQuestion[], attempt: AssessmentAttempt): GradingResult {
  const startedAt = new Date(attempt.startedAt).getTime();
  const finishedAt = new Date(attempt.finishedAt ?? attempt.updatedAt).getTime();
  
  const isScale = assessmentId.includes('scale');
  const answerKey = !isScale ? achievementAnswerKey : [];

  let correctCount = 0;
  let gradedTotalCount = 0;
  let scaleScore = 0;
  const maxScaleScore = questions.length * 5;

  const review = questions.map((question) => {
    const selectedAnswer = attempt.answers[question.id] ?? null;
    const normalizedSelected = selectedAnswer ? normalize(selectedAnswer) : null;
    const normalizedQuestion = normalize(question.text);
    
    if (isScale) {
      // Scale scoring logic
      let points = 0;
      const isReversed = reversedScaleQuestions.some(q => normalize(q) === normalizedQuestion) || normalizedQuestion.includes('(عكسية)');
      
      if (normalizedSelected) {
        if (isReversed) {
          points = reversedScalePoints[normalizedSelected] || 0;
        } else {
          points = scalePoints[normalizedSelected] || 0;
        }
      }
      
      scaleScore += points;
      
      return {
        id: question.id,
        text: question.text,
        selectedAnswer,
        correctAnswer: null,
        isCorrect: null,
        rationale: isReversed ? 'سؤال عكسي' : null,
      };
    } else {
      // Achievement test scoring logic
      const key = answerKey.find((entry) => normalize(entry.question) === normalizedQuestion);
      const correctAnswer = key?.correctAnswer ?? null;
      const isCorrect = correctAnswer ? normalizedSelected === normalize(correctAnswer) : null;
      
      if (correctAnswer) {
        gradedTotalCount++;
        if (isCorrect) correctCount++;
      }
      
      return {
        id: question.id,
        text: question.text,
        selectedAnswer,
        correctAnswer,
        isCorrect,
        rationale: key?.rationale ?? null,
      };
    }
  });

  const durationSeconds = Math.max(0, Math.round((finishedAt - startedAt) / 1000));
  
  if (isScale) {
    const percent = Math.round((scaleScore / maxScaleScore) * 100) || 0;
    return {
      score: scaleScore,
      gradedTotal: maxScaleScore,
      total: questions.length,
      correct: 0,
      wrong: 0,
      percent,
      durationSeconds,
      passPercent: 0,
      review,
      ungradedQuestionIds: [],
    };
  }

  const wrongCount = gradedTotalCount - correctCount;
  const percent = gradedTotalCount ? Math.round((correctCount / gradedTotalCount) * 100) : 0;

  return {
    score: correctCount,
    gradedTotal: gradedTotalCount,
    total: questions.length,
    correct: correctCount,
    wrong: wrongCount,
    percent,
    durationSeconds,
    passPercent: 60,
    review,
    ungradedQuestionIds: review.filter((item) => !item.correctAnswer).map((item) => item.id),
  };
}
