import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';

interface TimelinePathProps {
  points: { x: number; y: number }[];
  containerHeight: number;
}

export function TimelinePath({ points, containerHeight }: TimelinePathProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create a smooth SVG path using cubic beziers
  const generatePath = () => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      // Control points for a vertical flowing S-curve
      const ctrl1Y = current.y + (next.y - current.y) / 2;
      const ctrl2Y = current.y + (next.y - current.y) / 2;
      
      d += ` C ${current.x} ${ctrl1Y}, ${next.x} ${ctrl2Y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  const pathString = generatePath();

  if (points.length === 0) return null;

  return (
    <div ref={containerRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      <svg 
        className="w-full h-full" 
        style={{ minHeight: containerHeight }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(249, 115, 22, 0.8)" />
            <stop offset="100%" stopColor="rgba(249, 115, 22, 0.1)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background track */}
        <path
          d={pathString}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="6"
          strokeDasharray="12 12"
        />
        
        {/* Animated glowing progress line */}
        <motion.path
          d={pathString}
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="6"
          filter="url(#glow)"
          style={{ pathLength: smoothProgress }}
        />
      </svg>
    </div>
  );
}
