import React from 'react';
import type { ParagraphBlock } from '../../../../../types/blocks';
import { motion } from 'framer-motion';
import { Info, AlertTriangle, Lightbulb, CheckSquare } from 'lucide-react';

interface Props {
  block: ParagraphBlock;
}

export const ParagraphBlockRenderer: React.FC<Props> = React.memo(({ block }) => {
  const content = block.content.trim();
  
  // Enhancement Heuristics Layer
  const isNote = content.startsWith('ملاحظة') || content.startsWith('ملحوظة');
  const isWarning = content.startsWith('تحذير') || content.startsWith('تنبيه');
  const isActivity = content.startsWith('نشاط');
  const isReflection = content.startsWith('فكر') || content.startsWith('تأمل');
  
  if (isNote) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="my-4 p-4 rounded-2xl glass border border-blue-500/30 bg-blue-500/10 flex items-start gap-4 text-blue-100"
      >
        <Info className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
        <p className="leading-relaxed">{content}</p>
      </motion.div>
    );
  }

  if (isWarning) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="my-4 p-4 rounded-2xl glass border border-red-500/30 bg-red-500/10 flex items-start gap-4 text-red-100"
      >
        <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-1" />
        <p className="leading-relaxed">{content}</p>
      </motion.div>
    );
  }

  if (isActivity) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="my-6 p-6 rounded-3xl glass-orange border border-orange-500/40 bg-orange-500/10 flex items-start gap-4"
      >
        <CheckSquare className="w-8 h-8 text-orange-400 shrink-0" />
        <div>
          <h4 className="text-orange-400 font-bold mb-2">نشاط عملي</h4>
          <p className="text-gray-200 leading-relaxed">{content.replace(/^نشاط[\s:]*/, '')}</p>
        </div>
      </motion.div>
    );
  }

  if (isReflection) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="my-6 p-6 rounded-3xl glass border border-purple-500/40 bg-purple-500/10 flex items-start gap-4"
      >
        <Lightbulb className="w-8 h-8 text-purple-400 shrink-0" />
        <div>
          <h4 className="text-purple-400 font-bold mb-2">دعوة للتفكير</h4>
          <p className="text-gray-200 leading-relaxed">{content}</p>
        </div>
      </motion.div>
    );
  }

  // Base fallback rendering for standard paragraphs
  return (
    <motion.p 
      initial={{ opacity: 0 }} 
      whileInView={{ opacity: 1 }} 
      viewport={{ once: true }}
      className="text-gray-300 leading-loose mb-4 text-lg"
    >
      {content}
    </motion.p>
  );
});
