import { useEffect, useRef, useState } from 'react';
import { learningPath } from '../../data/learningPath';
import { useLearningProgress } from '../../hooks/useLearningProgress';
import { SectionTitle } from '../../shared/ui/SectionTitle';
import { TimelineNode } from './TimelineNode';
import { TimelinePath } from './TimelinePath';

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const nodeElements = containerRef.current.querySelectorAll('[data-timeline-node]');
      
      const newPoints: { x: number; y: number }[] = [];
      
      nodeElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Calculate center relative to the container
        const x = (rect.left + rect.right) / 2 - containerRect.left;
        const y = (rect.top + rect.bottom) / 2 - containerRect.top;
        newPoints.push({ x, y });
      });
      
      setPoints(newPoints);
      setContainerHeight(containerRef.current.scrollHeight);
    };

    // Initial calculation
    updatePositions();

    // Use ResizeObserver for responsive updates
    const observer = new ResizeObserver(() => {
      // Add a slight delay to allow layout shifts to settle
      requestAnimationFrame(updatePositions);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    // Also observe window resize as a fallback
    window.addEventListener('resize', updatePositions);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePositions);
    };
  }, []);

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
  const progressRatio = learningPath.length > 1 ? activeIndex / (learningPath.length - 1) : 0;

  return (
    <section className="relative py-32 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <SectionTitle 
        title="Your Journey" 
        subtitle="Follow the structured path to mastery. Each node unlocks profound scientific concepts."
        className="mb-24"
      />
      
      <div ref={containerRef} className="relative flex flex-col gap-32 md:gap-40">
        <TimelinePath points={points} containerHeight={containerHeight} progressRatio={progressRatio} />
        
        {learningPath.map((node, i) => (
          <TimelineNode key={node.id} node={node} index={i} />
        ))}
      </div>
    </section>
  );
}
