import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { contentRepository } from '../../services/content/contentRepository';
import { RadioCard } from './components/RadioCard';
import { ResultScreen } from './components/ResultScreen';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useAssessment } from '../../hooks/useAssessment';
import { useLearningProgress } from '../../hooks/useLearningProgress';
import { parseAssessmentQuestions } from './utils/assessmentParser';
import { gradeAssessment } from './utils/grading';

interface Props {
  assessmentId: string;
}

export function AssessmentRenderer({ assessmentId }: Props) {
  const { attempt, startAttempt, setAnswer, setCurrentIndex, finishAttempt, resetAttempt } = useAssessment(assessmentId);
  const { visitAssessment, markAssessmentCompleted } = useLearningProgress();
  const data = useMemo(() => {
    return contentRepository.getAssessment(assessmentId); 
  }, [assessmentId]);

  const questions = useMemo(() => {
    if (!data) return [];
    return parseAssessmentQuestions(data);
  }, [data]);

  useEffect(() => {
    visitAssessment(assessmentId);
    startAttempt(assessmentId);
  }, [assessmentId, startAttempt, visitAssessment]);

  if (!data || questions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 font-arabic" dir="rtl">
        لم يتم العثور على أسئلة التقييم.
      </div>
    );
  }

  const activeAttempt = attempt ?? startAttempt(assessmentId);
  const currentIndex = Math.min(activeAttempt.currentIndex, questions.length - 1);
  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  if (activeAttempt.finishedAt) {
    const result = gradeAssessment(assessmentId, questions, activeAttempt);
    return (
      <div className="font-arabic py-12" dir="rtl">
        <ResultScreen 
          score={result.score} 
          total={questions.length} 
          gradedTotal={result.gradedTotal}
          wrong={result.wrong}
          percent={result.percent}
          durationSeconds={result.durationSeconds}
          ungradedCount={result.ungradedQuestionIds.length}
          review={result.review}
          onContinue={() => window.location.assign('/')} 
          onRetry={() => {
            resetAttempt(assessmentId);
            startAttempt(assessmentId);
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto font-arabic pt-8" dir="rtl">
      {/* Header & Progress */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{data.title}</h2>
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>السؤال {currentIndex + 1} من {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass p-8 rounded-3xl border border-white/10 mb-8 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-8 leading-relaxed">
              {currentQ.text}
            </h3>
            
            <div className="space-y-4">
              {currentQ.choices.map((choice, idx) => (
                <RadioCard 
                  key={idx}
                  label={choice}
                  selected={activeAttempt.answers[currentQ.id] === choice}
                  onClick={() => setAnswer(assessmentId, currentQ.id, choice)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentIndex(assessmentId, Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 hover:bg-white/10 text-white"
        >
          <ChevronRight className="w-5 h-5" />
          <span>السابق</span>
        </button>
        
        <button 
          onClick={() => {
            if (currentIndex === questions.length - 1) {
              finishAttempt(assessmentId);
              markAssessmentCompleted(assessmentId);
            } else {
              setCurrentIndex(assessmentId, currentIndex + 1);
            }
          }}
          disabled={!activeAttempt.answers[currentQ.id]}
          className="px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-orange-500 hover:bg-orange-600 text-white glow-orange"
        >
          <span>{currentIndex === questions.length - 1 ? 'إنهاء' : 'التالي'}</span>
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
