import { useMemo, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ParsedLesson } from '../../utils/contentParser';
import { buildConceptGroups } from '../../utils/conceptGrouper';
import { ConceptGroupView } from './ConceptGroupView';
import { ActivityStep } from './ActivityStep';
import { StepProgressBar } from './StepProgressBar';
import { ObjectivesBox } from '../hierarchy/ObjectivesBox';
import { QuizComponent } from '../hierarchy/QuizComponent';
import { LessonSummary } from '../hierarchy/LessonSummary';
import { useProgressStore } from '../../../../stores/progress.store';

/** Discriminated union for each possible step type inside a lesson */
type LessonStep =
  | { type: 'objectives'; id: string }
  | { type: 'concept-group'; id: string; groupIndex: number }
  | { type: 'activity'; id: string; groupIndex: number }
  | { type: 'summary'; id: string }
  | { type: 'quiz'; id: string };

interface Props {
  moduleId: string;
  lessons: ParsedLesson[];
  onModuleComplete: () => void;
}

function buildSteps(lesson: ParsedLesson, groupingResult: ReturnType<typeof buildConceptGroups>): LessonStep[] {
  const steps: LessonStep[] = [];

  // Objectives first (if any)
  if (lesson.objectives.length > 0) {
    steps.push({ type: 'objectives', id: `${lesson.id}-objectives` });
  }

  // Concept groups + activities interleaved
  groupingResult.groups.forEach((group, idx) => {
    steps.push({ type: 'concept-group', id: `${lesson.id}-group-${idx}`, groupIndex: idx });
    if (group.activityQuestion) {
      steps.push({ type: 'activity', id: `${lesson.id}-activity-${idx}`, groupIndex: idx });
    }
  });

  // Summary (if exists)
  if (lesson.summary || lesson.summaryImage) {
    steps.push({ type: 'summary', id: `${lesson.id}-summary` });
  }

  // Quiz (if there are quiz assessments remaining after per-group use)
  if (groupingResult.quizAssessments.length > 0 || lesson.assessments.some(a => a.type === 'task')) {
    steps.push({ type: 'quiz', id: `${lesson.id}-quiz` });
  }

  return steps;
}

export function LessonJourneyController({ moduleId, lessons, onModuleComplete }: Props) {
  const journeyState = useProgressStore((s) => s.modules[moduleId]?.journeyState);
  const setJourneyStep = useProgressStore((s) => s.setJourneyStep);
  const markStepCompleted = useProgressStore((s) => s.markStepCompleted);
  const recordActivityResult = useProgressStore((s) => s.recordActivityResult);
  const setSectionCompleted = useProgressStore((s) => s.setSectionCompleted);
  const markQuizCompleted = useProgressStore((s) => s.markQuizCompleted);

  // Current lesson index & step index (from persisted state or defaults)
  const currentLessonIndex = journeyState?.currentLessonIndex ?? 0;
  const currentStepIndex = journeyState?.currentStepIndex ?? 0;
  const completedSteps: string[] = journeyState?.completedSteps ?? [];

  const lesson = lessons[Math.min(currentLessonIndex, lessons.length - 1)];

  // Build concept groups for this lesson
  const groupingResult = useMemo(() => buildConceptGroups(lesson), [lesson]);

  // Build ordered steps for this lesson
  const steps = useMemo(() => buildSteps(lesson, groupingResult), [lesson, groupingResult]);

  const safeStepIndex = Math.min(currentStepIndex, steps.length - 1);
  const currentStep = steps[safeStepIndex];

  // On mount: if journeyState is unset, initialize it
  useEffect(() => {
    if (!journeyState) {
      setJourneyStep(moduleId, 0, 0);
    }
  }, [moduleId, journeyState, setJourneyStep]);

  const advanceStep = useCallback((completedStepId: string) => {
    markStepCompleted(moduleId, completedStepId);
    const nextIndex = safeStepIndex + 1;

    if (nextIndex >= steps.length) {
      // End of this lesson
      setSectionCompleted(moduleId, lesson.id, lessons.length);
      const nextLessonIndex = currentLessonIndex + 1;
      if (nextLessonIndex < lessons.length) {
        // Advance to next lesson, step 0
        setJourneyStep(moduleId, nextLessonIndex, 0);
      } else {
        // All lessons done -> module complete
        onModuleComplete();
      }
    } else {
      setJourneyStep(moduleId, currentLessonIndex, nextIndex);
    }
  }, [moduleId, safeStepIndex, steps.length, currentLessonIndex, lessons.length, lesson.id, markStepCompleted, setJourneyStep, setSectionCompleted, onModuleComplete]);

  const goToStep = useCallback((targetIndex: number) => {
    const targetStep = steps[targetIndex];
    const completedInThisLesson = steps.filter(s => completedSteps.includes(s.id)).length;
    const isUnlocked = targetIndex <= completedInThisLesson;

    if (targetStep && isUnlocked) {
      setJourneyStep(moduleId, currentLessonIndex, targetIndex);
    }
  }, [steps, completedSteps, moduleId, currentLessonIndex, setJourneyStep]);

  const stepIds = steps.map((s) => s.id);

  return (
    <div className="space-y-module">
      {/* Lesson title */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-2 font-arabic border-b border-white/10 pb-4">
          {lesson.title}
        </h2>
      </div>

      {/* Step progress indicator */}
      <StepProgressBar
        lessonIndex={currentLessonIndex}
        totalLessons={lessons.length}
        stepIndex={safeStepIndex}
        totalSteps={steps.length}
        completedSteps={completedSteps}
        stepIds={stepIds}
        lessonTitle={lesson.title}
        onGoToStep={goToStep}
      />

      {/* Current step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep?.id ?? 'loading'}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.25 }}
        >
          {currentStep?.type === 'objectives' && (
            <div className="space-y-6">
              <ObjectivesBox objectives={lesson.objectives} />
              <div className="flex justify-start">
                <button
                  onClick={() => advanceStep(currentStep.id)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold transition-all hover:-translate-y-0.5 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                >
                  <span>ابدأ التعلم</span>
                  <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {currentStep?.type === 'concept-group' && (
            <ConceptGroupView
              group={groupingResult.groups[currentStep.groupIndex]}
              groupIndex={currentStep.groupIndex}
              totalGroups={groupingResult.groups.length}
              lessonTitle={lesson.title}
              onNext={() => advanceStep(currentStep.id)}
            />
          )}

          {currentStep?.type === 'activity' && (
            <ActivityStep
              group={groupingResult.groups[currentStep.groupIndex]}
              stepId={currentStep.id}
              moduleId={moduleId}
              onNext={(result) => {
                recordActivityResult(moduleId, currentStep.id, result);
                advanceStep(currentStep.id);
              }}
            />
          )}

          {currentStep?.type === 'summary' && (
            <div className="space-y-6">
              <LessonSummary
                moduleId={moduleId}
                sectionId={lesson.id}
                totalSections={lessons.length}
                summary={lesson.summary}
                summaryImage={lesson.summaryImage}
              />
              <div className="flex justify-start">
                <button
                  onClick={() => advanceStep(currentStep.id)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold transition-all hover:-translate-y-0.5 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                >
                  <span>التالي</span>
                  <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {currentStep?.type === 'quiz' && (
            <div className="space-y-6">
              <QuizComponent
                moduleId={moduleId}
                lessonId={lesson.id}
                assessments={groupingResult.quizAssessments.length > 0 ? groupingResult.quizAssessments : lesson.assessments}
                onCompleted={() => {
                  markQuizCompleted(moduleId, `${lesson.id}-quiz`);
                  advanceStep(currentStep.id);
                }}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
