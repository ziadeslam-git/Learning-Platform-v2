import { motion } from 'framer-motion';
import { type TimelineNodeData } from '../../data/learningPath';
import { cn } from '../../lib/utils';
import { CheckCircle, CircleDot } from '../../shared/icons';
import { Lock, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLearningProgress } from '../../hooks/useLearningProgress';

interface TimelineNodeProps {
  node: TimelineNodeData;
  index: number;
  isLocked?: boolean;
  isActive?: boolean;
}

export function TimelineNode({ node, index, isLocked, isActive }: TimelineNodeProps) {
  const navigate = useNavigate();
  const { modules, completedAssessments } = useLearningProgress();
  const moduleProgress = node.moduleId ? modules[node.moduleId] : null;
  const isCompleted = node.type === 'assessment'
    ? Boolean(completedAssessments[node.id])
    : Boolean(moduleProgress && moduleProgress.percent >= 100);

  const handleNavigation = () => {
    if (isLocked) return;
    
    if (node.id === 'final-results') {
      navigate('/final-results');
    } else if (node.type === 'assessment') {
      navigate(`/assessment/${node.id}`);
    } else if (node.type === 'module' && node.moduleId) {
      navigate(`/module/${node.moduleId}`);
    }
  };

  return (
    <motion.div
      data-timeline-node
      className="relative z-10 flex flex-col items-center flex-1 w-full md:w-auto group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <button
        onClick={handleNavigation}
        className={cn(
          'w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 relative bg-black',
          !isLocked && 'cursor-pointer hover:scale-105',
          isLocked && 'cursor-not-allowed opacity-60',
          isActive ? 'border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.4)]' : 
          isCompleted ? 'border-orange-400/50 hover:border-orange-400' : 
          'border-white/10'
        )}
      >
        {isCompleted && <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-orange-400" />}
        {isActive && <CircleDot className="w-8 h-8 md:w-10 md:h-10 text-orange-500 animate-pulse" />}
        {isLocked && <Lock className="w-7 h-7 md:w-8 md:h-8 text-gray-500" />}
        {!isCompleted && !isActive && !isLocked && <Circle className="w-7 h-7 md:w-8 md:h-8 text-gray-500" />}
      </button>
      
      <div className={cn(
        'mt-5 text-center glass px-3 md:px-4 py-3 rounded-xl border flex flex-col items-center transition-all duration-500 w-[85%] md:w-full max-w-[150px]',
        isActive ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] bg-orange-500/5' : 'border-white/5',
        isLocked && 'opacity-60 grayscale'
      )}>
        <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500/80 bg-orange-500/10 px-2 py-0.5 rounded-md font-sans mb-2 whitespace-nowrap">
          {node.type === 'assessment' ? 'التقييم' : `المرحلة 0${index + 1}`}
        </span>
        <h3 className={cn(
          "text-sm font-bold font-arabic leading-snug text-center",
          isActive ? "text-white glow-text" : isLocked ? "text-gray-500" : "text-gray-200"
        )}
          style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
        >
          {node.title}
        </h3>
      </div>
    </motion.div>
  );
}
