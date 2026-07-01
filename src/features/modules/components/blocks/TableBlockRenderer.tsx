import React from 'react';
import type { TableBlock } from '../../../../../types/blocks';
import { motion } from 'framer-motion';

interface Props {
  block: TableBlock;
}

export const TableBlockRenderer: React.FC<Props> = React.memo(({ block }) => {
  if (!block.rows || block.rows.length === 0) return null;

  const [headerRow, ...bodyRows] = block.rows;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      className="my-8 w-full overflow-hidden rounded-2xl glass border border-white/10"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]" dir="rtl">
          <thead>
            <tr className="bg-orange-500/20 text-orange-400 border-b border-orange-500/30">
              {headerRow.map((cell, idx) => (
                <th key={idx} className="p-4 font-bold text-sm uppercase tracking-wider whitespace-nowrap">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bodyRows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-white/5 transition-colors">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="p-4 text-gray-300 text-sm leading-relaxed">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
});
