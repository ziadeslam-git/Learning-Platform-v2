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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-orange text-orange-500 font-medium text-sm mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          System Online
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white glow-text leading-tight">
          Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Science</span>
          <br /> of Tomorrow
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
          An advanced, enterprise-grade learning platform designed to accelerate your scientific journey through interactive modules and rigorous assessments.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <GlowButton onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
            Start Learning
            <ArrowRight className="w-5 h-5" />
          </GlowButton>
        </div>
      </motion.div>
    </section>
  );
}
