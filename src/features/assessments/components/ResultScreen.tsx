import React from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronRight, RotateCcw } from 'lucide-react';
import type { GradedQuestion } from '../../../types/assessment';

interface Props {
  score: number;
  gradedTotal: number;
  wrong: number;
  percent: number;
  review: GradedQuestion[];
  isScale?: boolean;
  nextNodeName?: string;
  onContinue: () => void;
  onRetry?: () => void;
}

export const ResultScreen: React.FC<Props> = ({
  score,
  gradedTotal,
  wrong,
  percent,
  review,
  isScale,
  nextNodeName,
  onContinue,
  onRetry,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto border border-orange-500/20 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 border bg-green-500/20 border-green-500/40 glow-green text-green-400"
        >
          <Award className="w-12 h-12" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-8">
          تم حفظ إجاباتك بنجاح!
        </h2>
        
        <div className={`gap-4 mb-8 ${isScale ? 'flex justify-center max-w-md mx-auto w-full' : 'grid grid-cols-2 md:grid-cols-4'}`}>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center flex-1">
             <span className="text-gray-400 text-sm mb-1">الدرجة</span>
             <bdi dir="ltr" className="text-2xl font-bold text-orange-400">{score} / {gradedTotal}</bdi>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center flex-1">
             <span className="text-gray-400 text-sm mb-1">النسبة</span>
             <span className="text-2xl font-bold text-blue-400">{percent}%</span>
          </div>
          {!isScale && (
            <>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                <span className="text-gray-400 text-sm mb-1">إجابات صحيحة</span>
                <span className="text-2xl font-bold text-green-400">{score}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                <span className="text-gray-400 text-sm mb-1">إجابات خاطئة</span>
                <span className="text-2xl font-bold text-red-400">{wrong}</span>
              </div>
            </>
          )}
        </div>

        <div 
          className="text-right mb-8 max-h-[400px] overflow-y-auto space-y-4 pr-4 py-4"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.2) transparent',
            maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)'
          }}
        >
          {review.map((item, index) => (
            <div key={item.id} className="backdrop-blur-md bg-white/5 border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 shadow-lg">
              <p className="text-white font-semibold mb-3 leading-relaxed text-lg">{index + 1}. {item.text}</p>
              <div className="space-y-2">
                <p className="text-orange-300 text-sm">إجابتك: <span className="text-gray-200">{item.selectedAnswer ?? 'لم تتم الإجابة'}</span></p>
                {!isScale && (
                  <p className="text-green-400 text-sm">الإجابة الصحيحة: <span className="text-gray-200">{item.correctAnswer ?? 'غير متاحة بمصدر موثق'}</span></p>
                )}
                {item.rationale && <p className="text-blue-300 text-sm mt-2">{item.rationale}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onContinue}
            className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all glow-orange flex items-center justify-center gap-2"
          >
            <span>{nextNodeName ? `الانتقال إلى: ${nextNodeName}` : 'العودة للمسار التعليمي'}</span>
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          
          {onRetry && (
            <button 
              onClick={onRetry}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>إعادة الاختبار</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
