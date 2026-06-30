import { motion } from 'framer-motion';
import { contentRepository } from '../../services/content/contentRepository';
import { BookOpen } from '../../shared/icons';
import type { ParagraphBlock, HeadingBlock, Block } from '../../../types/blocks';

interface ModuleRendererProps {
  moduleId: string;
}

export function ModuleRenderer({ moduleId }: ModuleRendererProps) {
  const data = contentRepository.getModule(moduleId);

  if (!data) return null;

  // Extract a description and topics from the generic blocks to preserve UI design
  const blocks = data.sections[0]?.blocks || [];
  const descriptionBlock = blocks.find((b: Block) => b.type === 'ParagraphBlock') as ParagraphBlock | undefined;
  const description = descriptionBlock?.content || 'No description available.';
  
  const headingBlocks = blocks.filter((b: Block) => b.type === 'HeadingBlock').slice(0, 3) as HeadingBlock[];
  const topics = headingBlocks.length > 0 ? headingBlocks.map(h => h.content) : ['Concept Overview', 'Practical Application'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="mt-8 w-full max-w-2xl text-left glass-orange p-6 md:p-8 rounded-2xl border border-orange-500/20"
    >
      <div className="flex items-center gap-3 mb-4 text-orange-400">
        <BookOpen className="w-6 h-6" />
        <h4 className="text-xl font-bold font-arabic">{data.title.replace(/-/g, ' ')}</h4>
      </div>
      
      <p className="text-gray-300 mb-6 leading-relaxed font-arabic line-clamp-3">
        {description}
      </p>

      <div className="space-y-3">
        <h5 className="text-sm font-semibold text-orange-500 uppercase tracking-wider">Key Topics</h5>
        <ul className="space-y-2">
          {topics.map((topic, index) => (
            <li key={index} className="flex items-center gap-3 text-gray-300 font-arabic">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              <span className="line-clamp-1">{topic}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
