import { type ConceptGroup } from '../../utils/conceptGrouper';
import { contentRepository } from '../../../../services/content/contentRepository';
import { ArrowLeft, GitMerge, Lightbulb, Network } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  group: ConceptGroup;
}

export function ConceptVisual({ group }: Props) {
  // 1. Try to find a real image in the content
  let firstImage = null;
  for (const el of group.elements) {
    for (const sub of el.subConcepts) {
      if (sub.type === 'media' && sub.mediaType === 'image' && sub.url) {
        firstImage = sub;
        break;
      }
    }
    if (firstImage) break;
  }

  if (firstImage) {
    const imgSrc = contentRepository.getImage(firstImage.url);
    if (imgSrc) {
      return (
        <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 mb-8 relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img src={imgSrc} alt={firstImage.title} className="w-full h-auto object-cover max-h-[400px] transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute bottom-0 left-0 w-full p-6 z-20 text-center">
            <h4 className="text-white font-bold font-arabic text-xl drop-shadow-md">
              {firstImage.title !== 'صورة توضيحية' ? firstImage.title : 'شكل توضيحي'}
            </h4>
          </div>
        </div>
      );
    }
  }

  // 2. If no image, render a structured flow / relationship diagram based on the elements.
  const isProcess = group.elements.some(e => e.title.includes('خطوات') || e.title.includes('مراحل'));

  return (
    <div className="w-full rounded-3xl overflow-hidden border border-orange-500/10 bg-gradient-to-br from-black/80 to-purple-900/10 p-8 mb-8 relative">
      <div className="absolute top-4 right-4 text-orange-500/5">
        {isProcess ? <Network className="w-48 h-48" /> : <GitMerge className="w-48 h-48" />}
      </div>
      
      <div className="relative z-10">
        <h4 className="text-orange-400 font-bold font-arabic mb-6 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          <span>الخريطة المفاهيمية</span>
        </h4>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          {group.elements.map((el, idx) => (
            <div key={el.id} className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex-1 w-full md:w-48 text-center shadow-xl flex flex-col items-center justify-center min-h-[120px]"
              >
                {el.badgeNumber && (
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold mb-3 mx-auto">
                    {el.badgeNumber}
                  </div>
                )}
                <h5 className="text-white font-bold font-arabic text-sm leading-relaxed">
                  {el.title.replace(/[()]/g, '')}
                </h5>
              </motion.div>
              
              {idx < group.elements.length - 1 && (
                <div className="text-orange-500/40 hidden md:block">
                  <ArrowLeft className="w-6 h-6" />
                </div>
              )}
              {idx < group.elements.length - 1 && (
                <div className="text-orange-500/40 md:hidden rotate-90 my-2">
                  <ArrowLeft className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
