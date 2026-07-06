import React, { useState } from 'react';
import type { ImageBlock } from '../../../../../types/blocks';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X } from 'lucide-react';
import { contentRepository } from '../../../../services/content/contentRepository';

interface Props {
  block: ImageBlock;
}

export const ImageBlockRenderer: React.FC<Props> = React.memo(({ block }) => {
  const [isOpen, setIsOpen] = useState(false);

  const imageSrc = contentRepository.getImage(block.src) || `/${block.src}`;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        whileInView={{ opacity: 1, scale: 1 }} 
        viewport={{ once: true }}
        className="my-8 relative group cursor-pointer overflow-hidden rounded-2xl glass border border-white/10"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="تكبير الصورة"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <img 
          src={imageSrc} 
          alt={block.content || "صورة توضيحية"} 
          loading="lazy"
          className="w-full h-auto max-h-[500px] object-contain bg-black/40"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-orange-500/20 p-4 rounded-full glass-orange text-orange-400">
            <ZoomIn className="w-8 h-8" />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setIsOpen(false)}
          >
            <button 
              aria-label="إغلاق الصورة المكبرة"
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={imageSrc} 
              alt={block.content} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
