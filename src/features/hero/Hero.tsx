import { motion } from 'framer-motion';
import { GlowButton } from '../../shared/ui/GlowButton';
import { ArrowRight } from '../../shared/icons';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-28 md:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center z-10 max-w-4xl mx-auto flex flex-col items-center gap-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-orange text-orange-500 font-medium text-sm mb-4 font-arabic">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          المنصة جاهزة
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white glow-text leading-relaxed font-arabic">
          فاعلية توظيف تطبيقات <br className="hidden md:block" />
          <span className="text-orange-500">الذكاء الاصطناعي</span> ببيئة تدريب شخصية
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-loose font-arabic">
          في تنمية مهارات التحول الرقمي المهنية والتقبل التكنولوجي لدى القيادات التعليمية
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <GlowButton onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
            <span className="font-arabic font-bold text-lg">ابدأ رحلة التعلم</span>
            <ArrowRight className="w-5 h-5 rotate-180" />
          </GlowButton>
        </div>
      </motion.div>
    </section>
  );
}
