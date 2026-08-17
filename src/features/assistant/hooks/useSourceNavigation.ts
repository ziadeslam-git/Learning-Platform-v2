import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../../stores/progress.store';
import { learningPath } from '../../../data/learningPath';
import type { RetrievalDocument } from '../types';

export function useSourceNavigation(onNavigate?: () => void) {
  const navigate = useNavigate();
  const modules = useProgressStore((state) => state.modules);
  const completedAssessments = useProgressStore((state) => state.completedAssessments);

  // Determine active index in the global learning path
  let activeIndex = learningPath.length - 1;
  for (let i = 0; i < learningPath.length; i++) {
    const node = learningPath[i];
    const isCompleted = node.type === 'assessment'
      ? Boolean(completedAssessments[node.id])
      : Boolean(modules[node.moduleId!] && modules[node.moduleId!].percent >= 100);
    
    if (!isCompleted) {
      activeIndex = i;
      break;
    }
  }

  const checkIsLocked = useCallback((source: RetrievalDocument) => {
    if (source.moduleId === 'قائمة-الاهداف') return false; // About page is never locked

    // Check global module lock
    const targetModuleIndex = learningPath.findIndex(n => n.moduleId === source.moduleId);
    if (targetModuleIndex > activeIndex) return true;

    // Check internal module lesson lock if it's the currently active module
    if (targetModuleIndex === activeIndex) {
      const match = source.id.match(/_s(\d+)_/);
      const lessonIndex = match ? parseInt(match[1]) : 0;
      const currentLessonIndex = modules[source.moduleId]?.journeyState?.currentLessonIndex ?? 0;
      
      if (lessonIndex > currentLessonIndex) {
        return true;
      }
    }

    return false;
  }, [activeIndex, modules]);

  const navigateToSource = useCallback((source: RetrievalDocument) => {
    if (checkIsLocked(source)) return;

    if (onNavigate) {
      onNavigate(); // Typically used to close the assistant window
    }

    if (source.moduleId === 'قائمة-الاهداف') {
      navigate('/about');
    } else {
      navigate(`/module/${source.moduleId}`);
    }
  }, [checkIsLocked, navigate, onNavigate]);

  return {
    checkIsLocked,
    navigateToSource
  };
}
