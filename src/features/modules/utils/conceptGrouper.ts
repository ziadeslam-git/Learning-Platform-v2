import type { ParsedElement, ParsedAssessment, ParsedLesson } from './contentParser';

export interface ConceptGroup {
  id: string;
  elements: ParsedElement[];
  activityText: string | null;
  activityQuestion: ParsedAssessment | null;
}

export interface GroupingResult {
  groups: ConceptGroup[];
  usedAssessmentIds: Set<string>;
  quizAssessments: ParsedAssessment[];
}

const GROUP_SIZE = 2;

export function buildConceptGroups(lesson: ParsedLesson): GroupingResult {
  const { elements, activities, assessments } = lesson;

  const chunks: ParsedElement[][] = [];
  for (let i = 0; i < elements.length; i += GROUP_SIZE) {
    chunks.push(elements.slice(i, i + GROUP_SIZE));
  }

  const gradableAssessments = assessments.filter((a) => a.correctAnswer && a.type !== 'task');

  const usedAssessmentIds = new Set<string>();
  const groups: ConceptGroup[] = chunks.map((chunk, idx) => {
    const activityText = activities[idx] ?? null;
    const activityQuestion = gradableAssessments[idx] ?? null;
    if (activityQuestion) usedAssessmentIds.add(activityQuestion.id);
    return {
      id: `${lesson.id}-group-${idx}`,
      elements: chunk,
      activityText,
      activityQuestion,
    };
  });

  const quizAssessments = assessments.filter((a) => !usedAssessmentIds.has(a.id));
  return { groups, usedAssessmentIds, quizAssessments };
}
