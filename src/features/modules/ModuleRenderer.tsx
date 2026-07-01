import { motion } from 'framer-motion';
import { contentRepository } from '../../services/content/contentRepository';
import { BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import { BlockRenderer } from './components/BlockRenderer';

interface ModuleRendererProps {
  moduleId: string;
}

export function ModuleRenderer({ moduleId }: ModuleRendererProps) {
  const data = contentRepository.getModule(moduleId);

  if (!data) return null;

  const blocks = data.sections[0]?.blocks || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 w-full max-w-4xl mx-auto text-right font-arabic"
      dir="rtl"
    >
      {/* Module Header Card */}
      <div className="glass-orange p-8 rounded-3xl border border-orange-500/20 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4 mb-4 text-orange-400">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-3xl font-bold">{data.title.replace(/-/g, ' ')}</h1>
        </div>
      </div>

      {/* Interactive Content Rendering */}
      <div className="space-y-6">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
      
      {/* Completion Section */}
      <div className="mt-16 p-8 glass rounded-3xl text-center border border-white/10">
        <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">لقد أتممت قراءة المحتوى</h3>
        <p className="text-gray-400 mb-6">يمكنك الآن الانتقال إلى الأنشطة أو التقييم الخاص بهذا الموديول.</p>
        <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all glow-orange flex items-center justify-center gap-2 mx-auto">
          <span>التالي</span>
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
      </div>
    </motion.div>
  );
}
