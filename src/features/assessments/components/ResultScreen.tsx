import React from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronRight, RotateCcw } from 'lucide-react';

interface Props {
  score: number;
  total: number;
  onContinue: () => void;
  onRetry?: () => void;
}

export const ResultScreen: React.FC<Props> = ({ score, total, onContinue, onRetry }) => {
  const percentage = Math.round((score / total) * 100);
  const isPass = percentage >= 60;

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
          className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 border ${isPass ? 'bg-green-500/20 border-green-500/40 glow-green text-green-400' : 'bg-orange-500/20 border-orange-500/40 glow-orange text-orange-400'}`}
        >
          <Award className="w-12 h-12" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-2">
          {isPass ? 'لقد اجتزت التقييم بنجاح!' : 'لقد أتممت التقييم'}
        </h2>
        <p className="text-gray-400 mb-8">النتيجة النهائية الخاصة بك</p>

        <div className="flex justify-center items-center gap-8 mb-10">
          <div className="text-center">
            <div className="text-5xl font-black text-orange-400 mb-2">{percentage}%</div>
            <div className="text-sm text-gray-500 uppercase tracking-widest">النسبة المئوية</div>
          </div>
          <div className="w-px h-16 bg-white/10" />
          <div className="text-center">
            <div className="text-5xl font-black text-white mb-2">{score}/{total}</div>
            <div className="text-sm text-gray-500 uppercase tracking-widest">الإجابات الصحيحة</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onContinue}
            className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all glow-orange flex items-center justify-center gap-2"
          >
            <span>المتابعة</span>
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
