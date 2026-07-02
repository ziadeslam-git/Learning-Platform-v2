import { ChevronDown, BookMarked } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { contentRepository } from '../../../../services/content/contentRepository';
import { useLearningProgress } from '../../../../hooks/useLearningProgress';

export function LessonSummary({
  moduleId,
  sectionId,
  totalSections,
  summary,
  summaryImage,
}: {
  moduleId: string;
  sectionId: string;
  totalSections: number;
  summary: string | null;
  summaryImage?: string;
}) {
  const { modules, setActiveAccordion, setSectionCompleted } = useLearningProgress();
  const isOpen = modules[moduleId]?.activeAccordionId === sectionId;
  const imageSrc = summaryImage ? contentRepository.getImage(summaryImage) : null;
  const toggleOpen = () => {
    const nextOpen = !isOpen;
    setActiveAccordion(moduleId, nextOpen ? sectionId : null);
    if (nextOpen) setSectionCompleted(moduleId, sectionId, totalSections);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mt-section">
      <button 
        onClick={toggleOpen}
        className="w-full flex items-center justify-between p-6 text-right hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-4 text-orange-400">
          <BookMarked className="w-8 h-8" />
          <h3 className="text-2xl font-bold font-arabic">ملخص الدرس</h3>
        </div>
        <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 md:p-8 pt-0 border-t border-white/5">
              {summary || imageSrc ? (
                <>
                  {summary && (
                    <p className="text-gray-200 leading-relaxed text-lg font-arabic whitespace-pre-line mt-6">
                      {summary}
                    </p>
                  )}
                  
                  {imageSrc && (
                    <div className="mt-8 rounded-2xl overflow-hidden border border-white/10">
                      <img 
                        src={imageSrc}
                        alt="Lesson Summary" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 mt-4">
                  <p className="text-gray-500 font-arabic text-center">لا يوجد ملخص متاح حالياً.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
