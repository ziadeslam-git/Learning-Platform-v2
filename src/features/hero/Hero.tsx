import { motion } from 'framer-motion';
import { GlowButton } from '../../shared/ui/GlowButton';
import { ArrowRight } from '../../shared/icons';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-28 md:pt-20" style={{ perspective: 1200 }}>
      <motion.div
        initial={{ opacity: 0, rotateX: 45, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut', type: 'spring', bounce: 0.3 }}
        className="text-center z-10 max-w-4xl mx-auto flex flex-col items-center gap-8"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div 
          initial={{ opacity: 0, z: -50 }}
          animate={{ opacity: 1, z: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-orange text-orange-500 font-medium text-sm mb-4 font-arabic"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          المنصة جاهزة
        </motion.div>

        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white glow-text leading-relaxed font-arabic" style={{ transform: 'translateZ(50px)' }}>
          فاعلية توظيف تطبيقات <br className="hidden md:block" />
          <span className="text-orange-500 inline-block">الذكاء الاصطناعي</span> ببيئة تدريب شخصية
        </h1>

        <p className="text-lg md:text-2xl text-gray-300 max-w-3xl leading-loose font-arabic mt-4" style={{ transform: 'translateZ(30px)' }}>
          في تنمية مهارات التحول الرقمي المهنية والتقبل التكنولوجي لدى القيادات التعليمية
        </p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center" style={{ transform: 'translateZ(40px)' }}
        >
          <GlowButton onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
            <span className="font-arabic font-bold text-lg">ابدأ رحلة التعلم</span>
            <ArrowRight className="w-5 h-5 rotate-180" />
          </GlowButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
