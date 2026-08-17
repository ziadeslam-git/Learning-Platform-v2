import { learningPath } from '../../data/learningPath';
import { useLearningProgress } from '../../hooks/useLearningProgress';
import { SectionTitle } from '../../shared/ui/SectionTitle';
import { TimelineNode } from './TimelineNode';

export function Timeline() {
  const { modules, completedAssessments } = useLearningProgress();

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

  return (
    <section className="relative py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <SectionTitle 
        title="رحلة التدريب" 
        subtitle="مسار منظم. كل مرحلة تفتح لك مفاهيم تقنية جديدة."
        className="mb-16 md:mb-24"
      />
      
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4 w-full">
        {/* Horizontal line for desktop */}
        <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-white/10 -translate-y-1/2 z-0 rounded-full" />
        
        {/* Progress line for desktop */}
        <div 
          className="hidden md:block absolute top-12 right-0 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]" 
          style={{ width: `${learningPath.length > 1 ? (activeIndex / (learningPath.length - 1)) * 100 : 0}%` }}
        />

        {/* Vertical line for mobile */}
        <div className="md:hidden absolute left-1/2 top-0 w-1 h-full bg-white/10 -translate-x-1/2 z-0 rounded-full" />

        {/* Vertical progress line for mobile */}
        <div 
          className="md:hidden absolute left-1/2 top-0 w-1 bg-orange-500 -translate-x-1/2 z-0 transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]"
          style={{ height: `${learningPath.length > 1 ? (activeIndex / (learningPath.length - 1)) * 100 : 0}%` }}
        />
        
        {learningPath.map((node, i) => {
          const isLocked = i > activeIndex;
          const isActive = i === activeIndex;
          return (
            <TimelineNode 
              key={node.id} 
              node={node} 
              index={i} 
              isLocked={isLocked} 
              isActive={isActive} 
            />
          );
        })}
      </div>
    </section>
  );
}
