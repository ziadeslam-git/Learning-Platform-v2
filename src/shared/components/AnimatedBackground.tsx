import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0b0c10]">
      {/* Dynamic ambient gradients */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.8) 0%, rgba(0,0,0,0) 70%)' }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.div
        className="absolute top-[40%] right-[0%] w-[60vw] h-[60vw] rounded-full opacity-10 blur-[150px]"
        style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.6) 0%, rgba(0,0,0,0) 70%)' }}
        animate={{
          x: [0, -40, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      
      {/* Subtle grid pattern for futuristic feel */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} 
      />
    </div>
  );
}
