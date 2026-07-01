import React from 'react';
import type { HeadingBlock } from '../../../../../types/blocks';
import { motion } from 'framer-motion';

interface Props {
  block: HeadingBlock;
}

export const HeadingBlockRenderer: React.FC<Props> = React.memo(({ block }) => {
  const content = block.content.trim();
  
  if (block.level === 1) {
    return (
      <motion.h2 
        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        className="text-3xl font-bold text-white mt-12 mb-6 flex items-center gap-4"
      >
        <span className="w-2 h-10 bg-orange-500 rounded-full glow-orange"></span>
        {content}
      </motion.h2>
    );
  }

  if (block.level === 2) {
    return (
      <motion.h3 
        initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        className="text-2xl font-bold text-orange-400 mt-10 mb-4"
      >
        {content}
      </motion.h3>
    );
  }

  return (
    <motion.h4 
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
      className="text-xl font-semibold text-gray-200 mt-8 mb-3"
    >
      {content}
    </motion.h4>
  );
});
