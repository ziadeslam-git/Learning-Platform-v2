import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { contentRepository } from '../services/content/contentRepository';
import { AnimatedBackground } from '../shared/components/AnimatedBackground';
import { ChevronLeft, ChevronDown, BookOpen, Target, PenTool, CheckCircle } from 'lucide-react';
import { BlockRenderer } from '../features/modules/components/BlockRenderer';
import type { Block } from '../../types/blocks';

interface ModuleSection {
  id: string;
  title: string;
  blocks: Block[];
  icon?: React.ReactNode;
}

export function ModulePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const data = contentRepository.getModule(id || '');
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  const sections = useMemo(() => {
    if (!data) return [];
    const blocks = data.sections[0]?.blocks || [];
    const grouped: ModuleSection[] = [];
    let current: ModuleSection = { 
      id: 'intro', 
      title: 'مقدمة الموديول', 
      blocks: [], 
      icon: <BookOpen className="w-6 h-6" /> 
    };

    blocks.forEach(block => {
      const content = block.content.trim();
      const isBoundary = 
        (content.startsWith('الدرس') || 
         content.includes('الأهداف') || 
         content === 'الأنشطة' || 
         content === 'التقويم' || 
         content === 'الخلاصة') && content.length < 40;

      if (isBoundary) {
        if (current.blocks.length > 0 || current.title !== 'مقدمة الموديول') {
          grouped.push(current);
        }
        
        let icon = <BookOpen className="w-6 h-6" />;
        if (content.includes('الأهداف')) icon = <Target className="w-6 h-6" />;
        if (content.includes('نشاط') || content.includes('الأنشطة')) icon = <PenTool className="w-6 h-6" />;
        if (content.includes('التقويم')) icon = <CheckCircle className="w-6 h-6" />;

        current = { id: block.id, title: content, blocks: [], icon };
      } else {
        current.blocks.push(block);
      }
    });
    
    if (current.blocks.length > 0) {
      grouped.push(current);
    }
    
    return grouped;
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-arabic">
        <p>الموديول غير موجود.</p>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full bg-black text-white font-arabic selection:bg-orange-500/30 overflow-x-hidden pb-32" dir="rtl">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors mb-12 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform rotate-180" />
          <span>العودة للرئيسية</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-orange p-8 md:p-12 rounded-3xl border border-orange-500/20 mb-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-orange-300 to-orange-600 mb-4 relative z-10">
            {data.title.replace(/-/g, ' ')}
          </h1>
          <p className="text-orange-200/70 text-lg relative z-10">
            يرجى تصفح محتويات الموديول بالترتيب لضمان أقصى استفادة.
          </p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, idx) => {
            const isOpen = openSectionId === section.id;
            
            return (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`glass border transition-all duration-500 rounded-3xl overflow-hidden ${
                  isOpen ? 'border-orange-500/50 bg-black/60 shadow-2xl shadow-orange-500/10' : 'border-white/10 hover:border-orange-500/30 hover:bg-white/5'
                }`}
              >
                <button 
                  onClick={() => setOpenSectionId(isOpen ? null : section.id)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-right outline-none group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-colors duration-300 ${isOpen ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-gray-400 group-hover:text-orange-400 group-hover:bg-orange-500/10'}`}>
                      {section.icon}
                    </div>
                    <h2 className={`text-xl md:text-2xl font-bold transition-colors ${isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                      {section.title}
                    </h2>
                  </div>
                  <ChevronDown className={`w-6 h-6 transition-transform duration-500 text-gray-400 group-hover:text-orange-400 ${isOpen ? 'rotate-180 text-orange-400' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-8 pb-8 pt-2 border-t border-white/5">
                        <div className="max-w-4xl mx-auto space-y-6 mt-6">
                          {section.blocks.map(block => (
                            <BlockRenderer key={block.id} block={block} />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
