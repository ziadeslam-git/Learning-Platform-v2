import type { ParsedLesson } from '../../utils/contentParser';
import { ObjectivesBox } from './ObjectivesBox';
import { ElementSection } from './ElementSection';
import { ActivityChecklist } from './ActivityChecklist';
import { QuizComponent } from './QuizComponent';
import { LessonSummary } from './LessonSummary';

interface Props {
  lesson: ParsedLesson;
  moduleId: string;
  totalSections: number;
}

export function LessonContainer({ lesson, moduleId, totalSections }: Props) {
  return (
    <div className="mb-module">
      <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-section font-arabic border-b border-white/10 pb-4">
        {lesson.title}
      </h2>
      
      {lesson.objectives.length > 0 && <ObjectivesBox objectives={lesson.objectives} />}
      
      <div className="space-y-section mt-section">
        {lesson.elements.map((element, idx) => (
          <ElementSection key={idx} element={element} />
        ))}
        
        {lesson.activities.length > 0 && <ActivityChecklist moduleId={moduleId} activities={lesson.activities} />}
        
        {lesson.assessments.length > 0 && <QuizComponent assessments={lesson.assessments} />}
        
        {(lesson.summary || lesson.summaryImage) && (
          <LessonSummary
            moduleId={moduleId}
            sectionId={lesson.id}
            totalSections={totalSections}
            summary={lesson.summary}
            summaryImage={lesson.summaryImage}
          />
        )}
      </div>
    </div>
  );
}
