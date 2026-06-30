import { motion } from 'framer-motion';
import { type TimelineNodeData } from '../../data/learningPath';
import { cn } from '../../lib/utils';
import { CheckCircle, CircleDot, Lock } from '../../shared/icons';
import { ModuleRenderer } from '../modules';

interface TimelineNodeProps {
  node: TimelineNodeData;
  index: number;
}

export function TimelineNode({ node, index }: TimelineNodeProps) {
  const isCompleted = node.status === 'completed';
  const isActive = node.status === 'active';
  const isLocked = node.status === 'locked';

  // Determine alignment based on index to create the S-shape flow
  // 0: left, 1: center-right, 2: right, 3: center-left, 4: left
  const alignmentClass = [
    'md:self-start md:ml-[10%]',
    'md:self-center md:ml-[20%]',
    'md:self-end md:mr-[10%]',
    'md:self-center md:mr-[20%]',
    'md:self-start md:ml-[10%]',
  ][index % 5];

  return (
    <motion.div
      data-timeline-node
      className={cn('relative z-10 flex flex-col items-center w-full md:w-auto', alignmentClass)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div
        className={cn(
          'w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center border-4 transition-all duration-500',
          isActive ? 'border-orange-500 bg-orange-500/20 glow-orange' : 
          isCompleted ? 'border-orange-400/50 bg-white/5' : 
          'border-gray-800 bg-black/50 glass',
          'hover:scale-105 cursor-default'
        )}
      >
        {isCompleted && <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-orange-400" />}
        {isActive && <CircleDot className="w-10 h-10 md:w-12 md:h-12 text-orange-500 animate-pulse" />}
        {isLocked && <Lock className="w-8 h-8 md:w-10 md:h-10 text-gray-600" />}
      </div>
      
      <div className={cn('mt-6 text-center glass px-6 py-3 rounded-2xl border flex flex-col items-center', 
        isActive ? 'border-orange-500/30' : 'border-white/5'
      )}>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-1">
          {node.type === 'assessment' ? 'Assessment' : `Phase 0${index}`}
        </p>
        <h3 className={cn("text-lg md:text-xl font-semibold", isActive ? "text-white glow-text" : "text-gray-300")}>
          {node.title}
        </h3>
        
        {node.moduleId && (
          <div className="mt-4 w-full">
            <ModuleRenderer moduleId={node.moduleId} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
