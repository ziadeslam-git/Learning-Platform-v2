import { useProgressStore } from '../stores/progress.store';

export function useLearningProgress() {
  const lastModuleId = useProgressStore((state) => state.lastModuleId);
  const lastAssessmentId = useProgressStore((state) => state.lastAssessmentId);
  const modules = useProgressStore((state) => state.modules);
  const completedAssessments = useProgressStore((state) => state.completedAssessments);
  const visitModule = useProgressStore((state) => state.visitModule);
  const visitAssessment = useProgressStore((state) => state.visitAssessment);
  const setActiveAccordion = useProgressStore((state) => state.setActiveAccordion);
  const setSectionCompleted = useProgressStore((state) => state.setSectionCompleted);
  const setChecklistItem = useProgressStore((state) => state.setChecklistItem);
  const markAssessmentCompleted = useProgressStore((state) => state.markAssessmentCompleted);
  const addLearningSeconds = useProgressStore((state) => state.addLearningSeconds);
  const getStats = useProgressStore((state) => state.getStats);

  return {
    lastModuleId,
    lastAssessmentId,
    modules,
    completedAssessments,
    visitModule,
    visitAssessment,
    setActiveAccordion,
    setSectionCompleted,
    setChecklistItem,
    markAssessmentCompleted,
    addLearningSeconds,
    getStats,
  };
}
