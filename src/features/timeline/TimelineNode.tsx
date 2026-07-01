import { motion } from 'framer-motion';
import { type TimelineNodeData } from '../../data/learningPath';
import { cn } from '../../lib/utils';
import { CheckCircle, CircleDot, Lock } from '../../shared/icons';
import { useNavigate } from 'react-router-dom';

interface TimelineNodeProps {
  node: TimelineNodeData;
  index: number;
}

export function TimelineNode({ node, index }: TimelineNodeProps) {
  const navigate = useNavigate();
  const isCompleted = node.status === 'completed';
  const isActive = node.status === 'active';
  const isLocked = node.status === 'locked';

  // Determine alignment based on index to create the S-shape flow
  const alignmentClass = [
    'md:self-start md:ml-[10%]',
    'md:self-center md:ml-[20%]',
    'md:self-end md:mr-[10%]',
    'md:self-center md:mr-[20%]',
    'md:self-start md:ml-[10%]',
  ][index % 5];

  const handleNavigation = () => {
    if (isLocked) return;
    if (node.type === 'assessment') {
      const type = node.id === 'pre-assessment' ? 'pre' : 'post';
      navigate(`/assessment/${type}`);
    } else if (node.type === 'module' && node.moduleId) {
      navigate(`/module/${node.moduleId}`);
    }
  };

  return (
    <motion.div
      data-timeline-node
      className={cn('relative z-10 flex flex-col items-center w-full md:w-auto', alignmentClass)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <button
        onClick={handleNavigation}
        disabled={isLocked}
        className={cn(
          'w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center border-4 transition-all duration-500',
          isActive ? 'border-orange-500 bg-orange-500/20 glow-orange hover:scale-105' : 
          isCompleted ? 'border-orange-400/50 bg-white/5 hover:scale-105 hover:bg-white/10' : 
          'border-gray-800 bg-black/50 glass cursor-not-allowed'
        )}
      >
        {isCompleted && <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-orange-400" />}
        {isActive && <CircleDot className="w-10 h-10 md:w-12 md:h-12 text-orange-500 animate-pulse" />}
        {isLocked && <Lock className="w-8 h-8 md:w-10 md:h-10 text-gray-600" />}
      </button>
      
      <div className={cn('mt-6 text-center glass px-6 py-3 rounded-2xl border flex flex-col items-center', 
        isActive ? 'border-orange-500/30' : 'border-white/5'
      )}>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-1">
          {node.type === 'assessment' ? 'التقييم' : `المرحلة 0${index}`}
        </p>
        <h3 className={cn("text-lg md:text-xl font-semibold font-arabic", isActive ? "text-white glow-text" : "text-gray-300")}>
          {node.title.includes('Assessment') ? (node.id === 'pre-assessment' ? 'التقييم القبلي' : 'التقييم البعدي') : node.title.replace('Module', 'الموديول')}
        </h3>
      </div>
    </motion.div>
  );
}
