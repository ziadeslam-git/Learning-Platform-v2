import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0b0c10] pointer-events-none">
      <motion.div
        className="absolute -top-[18%] -left-[12%] w-[48vw] h-[48vw] rounded-full opacity-20 blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.7) 0%, rgba(249,115,22,0.14) 38%, rgba(0,0,0,0) 72%)' }}
        animate={{
          x: [0, 28, 0],
          y: [0, 18, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.div
        className="absolute top-[26%] right-[-16%] w-[54vw] h-[54vw] rounded-full opacity-12 blur-[150px]"
        style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.55) 0%, rgba(255,107,0,0.10) 42%, rgba(0,0,0,0) 74%)' }}
        animate={{
          x: [0, -22, 0],
          y: [0, 30, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      <div 
        className="absolute inset-0 opacity-[0.18]"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(1200px) rotateX(18deg) scale(1.12) translateY(-2%)',
          transformOrigin: 'top center',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.72) 52%, rgba(0,0,0,0.38) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.72) 52%, rgba(0,0,0,0.38) 100%)'
        }} 
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(255,107,0,0.07), transparent 24%, transparent 76%, rgba(255,107,0,0.05)), radial-gradient(circle at 50% 42%, transparent 0%, rgba(11,12,16,0.18) 48%, rgba(11,12,16,0.66) 100%)',
        }}
      />
    </div>
  );
}
