import React, { useState } from 'react';
import type { ParagraphBlock } from '../../../../../types/blocks';
import { motion } from 'framer-motion';
import { Info, AlertTriangle, Lightbulb, CheckSquare, Square } from 'lucide-react';

interface Props {
  block: ParagraphBlock;
}

export const ParagraphBlockRenderer: React.FC<Props> = React.memo(({ block }) => {
  const content = block.content.trim();
  const [isChecked, setIsChecked] = useState(false);
  
  // Enhancement Heuristics Layer
  const isNote = content.startsWith('ملاحظة') || content.startsWith('ملحوظة') || content.startsWith('هام');
  const isWarning = content.startsWith('تحذير') || content.startsWith('تنبيه');
  const isActivity = content.startsWith('نشاط') || content.includes('تدريب');
  const isReflection = content.startsWith('فكر') || content.startsWith('تأمل');
  
  if (isNote) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="my-4 p-5 rounded-2xl glass border-l-4 border-l-orange-500 border-white/10 bg-orange-500/5 flex items-start gap-4 text-orange-100"
      >
        <Info className="w-6 h-6 text-orange-400 shrink-0 mt-1" />
        <p className="leading-relaxed text-lg">{content}</p>
      </motion.div>
    );
  }

  if (isWarning) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="my-4 p-5 rounded-2xl glass border-l-4 border-l-red-500 border-white/10 bg-red-500/5 flex items-start gap-4 text-red-100"
      >
        <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-1" />
        <p className="leading-relaxed text-lg">{content}</p>
      </motion.div>
    );
  }

  if (isActivity) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className={`my-6 p-6 rounded-3xl border transition-colors flex items-start gap-4 cursor-pointer select-none
          ${isChecked ? 'bg-green-500/10 border-green-500/30' : 'glass border-white/10 hover:border-orange-500/30'}
        `}
        onClick={() => setIsChecked(!isChecked)}
      >
        <div className="shrink-0 mt-1 transition-colors">
          {isChecked ? (
            <CheckSquare className="w-8 h-8 text-green-400" />
          ) : (
            <Square className="w-8 h-8 text-orange-400" />
          )}
        </div>
        <div>
          <h4 className={`font-bold mb-2 ${isChecked ? 'text-green-400' : 'text-orange-400'}`}>نشاط تفاعلي</h4>
          <p className={`${isChecked ? 'text-gray-400 line-through' : 'text-gray-200'} leading-relaxed text-lg transition-all`}>
            {content.replace(/^(نشاط|تدريب)[\s:]*/, '')}
          </p>
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
        <Lightbulb className="w-8 h-8 text-purple-400 shrink-0 mt-1" />
        <div>
          <h4 className="text-purple-400 font-bold mb-2">دعوة للتفكير</h4>
          <p className="text-gray-200 leading-relaxed text-lg">{content}</p>
        </div>
      </motion.div>
    );
  }

  // Base fallback rendering for standard paragraphs (Glass Card)
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      className="my-4 p-5 md:p-6 rounded-2xl glass border border-white/5 hover:border-white/10 transition-colors bg-white/[0.02]"
    >
      <p className="text-gray-200 leading-loose text-lg font-arabic">
        {content}
      </p>
    </motion.div>
  );
});
