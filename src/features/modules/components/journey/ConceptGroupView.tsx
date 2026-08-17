import { motion } from 'framer-motion';
import type { ConceptGroup } from '../../utils/conceptGrouper';
import { ElementSection } from '../hierarchy/ElementSection';
import { ConceptVisual } from './ConceptVisual';
import { BookOpen } from 'lucide-react';

interface Props {
  group: ConceptGroup;
  groupIndex: number;
  totalGroups: number;
  lessonTitle: string;
  onNext: () => void;
}

export function ConceptGroupView({ group, groupIndex, totalGroups, lessonTitle, onNext }: Props) {
  // Determine a unified title for the group
  const groupTitle = group.elements.length > 1 
    ? 'المفاهيم الأساسية' 
    : group.elements[0]?.title || 'مفهوم جديد';

  return (
    <motion.div
      key={group.id}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-xl">
        
        {/* Header Area */}
        <div className="p-6 md:p-10 border-b border-white/5 bg-gradient-to-b from-white/[0.05] to-transparent">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-l from-orange-500/50 to-transparent" />
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest whitespace-nowrap bg-orange-500/10 px-3 py-1 rounded-full">
              {lessonTitle} — المجموعة {groupIndex + 1} من {totalGroups}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-orange-500/50 to-transparent" />
          </div>

          <div className="flex items-center gap-4 justify-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-arabic text-center leading-tight">
              {groupTitle}
            </h2>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 md:p-10">
          {/* Visual Explanation Area */}
          <ConceptVisual group={group} />

          {/* Explanation & Related Elements */}
          <div className="space-y-6">
            {group.elements.map((element) => (
              <ElementSection key={element.id} element={element} />
            ))}
          </div>
        </div>

        {/* Footer & CTA */}
        <div className="p-6 md:p-10 border-t border-white/5 bg-black/20 flex flex-col items-center">
          <p className="text-gray-400 font-arabic text-sm mb-6 text-center">
            {group.activityQuestion 
              ? 'أجب عن نشاط المفهوم لاختبار مدى فهمك للمجموعة'
              : 'لقد أتممت قراءة هذه المفاهيم. يمكنك الآن الانتقال للمرحلة التالية.'}
          </p>
          <button
            onClick={onNext}
            className="flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg transition-all hover:-translate-y-1 shadow-[0_0_30px_rgba(249,115,22,0.4)] w-full sm:w-auto font-arabic"
          >
            <span>{group.activityQuestion ? 'انتقل للنشاط' : 'المتابعة'}</span>
            <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
