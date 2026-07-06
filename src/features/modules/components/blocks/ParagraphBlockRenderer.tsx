import React, { useState } from 'react';
import type { ParagraphBlock } from '../../../../../types/blocks';
import { motion } from 'framer-motion';
import { Info, AlertTriangle, Lightbulb, CheckSquare, Square, Play, ExternalLink } from 'lucide-react';

interface Props {
  block: ParagraphBlock;
}

export const ParagraphBlockRenderer: React.FC<Props> = React.memo(({ block }) => {
  const content = block.content.trim();
  const [isChecked, setIsChecked] = useState(false);
  
  if (!content) return null;

  // Render supported video URL patterns as media cards.
  const youtubeMatch = content.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return (
      <div className="my-6 max-w-2xl mx-auto">
        <a 
          href={content.match(/(https?:\/\/[^\s]+)/)?.[0] || content}
          target="_blank"
          rel="noopener noreferrer"
          className="group block relative rounded-3xl overflow-hidden aspect-video bg-black/50 border border-white/10 hover:border-orange-500/50 transition-all shadow-xl"
        >
          <img 
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
            alt="Video Thumbnail"
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
            onError={(e) => {
              // Fallback to high quality if maxresdefault doesn't exist
              e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-orange-500/80 text-white flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(249,115,22,0.5)]">
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            </div>
          </div>
        </a>
      </div>
    );
  }

  // Render external URL patterns as action buttons.
  const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
  if (urlMatch) {
    return (
      <a 
        href={urlMatch[1]}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/10 transition-colors text-orange-400 font-medium my-2"
      >
        <span>{content.replace(urlMatch[1], '').trim() || 'رابط خارجي'}</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    );
  }

  // Render explicit bullet markers such as -, *, •, 1-, and 2-.
  const isBullet = /^[-*•\u2022\u25E6\u25AA]/.test(content) || /^\d+[-.]/.test(content);
  if (isBullet) {
    return (
      <div className="flex items-start gap-3 my-3 text-gray-200 hover:text-white transition-colors">
        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2.5 shrink-0 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
        <p className="leading-relaxed text-lg font-arabic flex-1">
          {content.replace(/^[-*•\u2022\u25E6\u25AA\d\s.-]+/, '')}
        </p>
      </div>
    );
  }

  // Callouts
  const isNote = content.startsWith('ملاحظة') || content.startsWith('ملحوظة') || content.startsWith('هام');
  const isWarning = content.startsWith('تحذير') || content.startsWith('تنبيه');
  const isActivity = content.startsWith('نشاط') || content.includes('تدريب');
  const isReflection = content.startsWith('فكر') || content.startsWith('تأمل');
  
  if (isNote) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="my-6 p-5 rounded-2xl bg-orange-500/5 border-r-4 border-r-orange-500 flex items-start gap-4 text-orange-100"
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
        className="my-6 p-5 rounded-2xl bg-red-500/5 border-r-4 border-r-red-500 flex items-start gap-4 text-red-100"
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
        className={`my-6 p-6 rounded-3xl border transition-all duration-300 flex items-start gap-4 cursor-pointer select-none
          ${isChecked ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-white/10 hover:border-orange-500/30'}
        `}
        onClick={() => setIsChecked(!isChecked)}
        role="checkbox"
        aria-checked={isChecked}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsChecked(!isChecked);
          }
        }}
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
        className="my-6 p-6 rounded-3xl bg-purple-500/5 border-r-4 border-r-purple-500 flex items-start gap-4 text-purple-100"
      >
        <Lightbulb className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
        <div>
          <h4 className="text-purple-400 font-bold mb-2">دعوة للتفكير</h4>
          <p className="leading-relaxed text-lg">{content}</p>
        </div>
      </motion.div>
    );
  }

  // Base fallback rendering for standard paragraphs (NO GLASS BOX, just text)
  // This achieves "Less Boxes, More Content" inside the parent section.
  return (
    <p className="text-gray-200/90 leading-loose text-lg md:text-xl font-arabic my-3">
      {content}
    </p>
  );
});
