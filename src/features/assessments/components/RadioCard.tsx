import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  selected: boolean;
  label: string;
  onClick: () => void;
}

export const RadioCard: React.FC<Props> = ({ selected, label, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-4
        ${selected 
          ? 'bg-orange-500/20 border-orange-500 text-white' 
          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-orange-500/50'
        }`}
    >
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
        ${selected ? 'border-orange-500 bg-orange-500' : 'border-gray-500'}
      `}>
        {selected && <CheckCircle2 className="w-4 h-4 text-black" />}
      </div>
      <span className="text-lg leading-relaxed select-none">{label}</span>
    </motion.div>
  );
};
