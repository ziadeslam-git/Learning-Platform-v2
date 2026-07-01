import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { contentRepository } from '../../services/content/contentRepository';
import { RadioCard } from './components/RadioCard';
import { ResultScreen } from './components/ResultScreen';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  assessmentId: string;
  type: 'pre' | 'post' | 'module';
}

interface ParsedQuestion {
  id: string;
  text: string;
  choices: string[];
}

export function AssessmentRenderer({ assessmentId, type }: Props) {
  // 1. Fetch data
  const data = useMemo(() => {
    if (type === 'pre') return contentRepository.getPreAssessment();
    if (type === 'post') return contentRepository.getPostAssessment();
    // module assessments are not fully defined in separate files yet, so fallback to pre
    return contentRepository.getPreAssessment(); 
  }, [type, assessmentId]);

  // 2. Heuristic Parser
  const questions = useMemo(() => {
    if (!data) return [];
    const blocks = data.sections[0]?.blocks || [];
    const parsed: ParsedQuestion[] = [];
    
    // Likert Scale Heuristic (Post Assessment)
    if (data.id.includes('مقياس')) {
      const likertChoices = ['أوافق بشدة', 'أوافق', 'لا أدري', 'لا أوافق', 'لا أوافق بشدة'];
      for (let i = 0; i < blocks.length; i++) {
        const text = blocks[i].content.trim();
        // A Likert statement usually starts after a number or is a long sentence
        // Looking at the JSON, they are often preceded by a block with just a number.
        if (/^\d+$/.test(text) && i + 1 < blocks.length) {
           const statement = blocks[i+1].content.trim();
           if (statement.length > 15) { // Arbitrary length to ensure it's a statement
             parsed.push({ id: blocks[i+1].id, text: statement, choices: likertChoices });
             i++; // skip the statement block
           }
        }
      }
      return parsed;
    }

    // Cognitive Test Heuristic (Pre/Module Assessment)
    for (let i = 0; i < blocks.length; i++) {
      const text = blocks[i].content.trim();
      
      // Detect True/False
      if (text === 'صواب' && i > 0 && i + 1 < blocks.length && blocks[i+1].content.trim() === 'خطأ') {
        const qText = blocks[i-1].content;
        // avoid pushing duplicate if it's already pushed (edge cases)
        if (!parsed.find(q => q.id === blocks[i-1].id)) {
           parsed.push({ id: blocks[i-1].id, text: qText, choices: ['صواب', 'خطأ'] });
        }
      }
      
      // Detect MCQ (أ- , ب- , ج- , د-)
      if (text === 'أ-' && i > 0) {
        const qText = blocks[i-1].content;
        const choices = [];
        let j = i;
        // collect up to 4 choices
        while (j < blocks.length && choices.length < 4) {
           if (['أ-', 'ب-', 'ج-', 'د-'].includes(blocks[j].content.trim())) {
             if (j + 1 < blocks.length) {
               choices.push(blocks[j+1].content.trim());
               j += 2;
             } else {
               break;
             }
           } else {
             break;
           }
        }
        if (choices.length > 0 && !parsed.find(q => q.id === blocks[i-1].id)) {
           parsed.push({ id: blocks[i-1].id, text: qText, choices });
        }
      }
    }
    
    return parsed;
  }, [data]);

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!data || questions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 font-arabic" dir="rtl">
        لم يتم العثور على أسئلة التقييم.
      </div>
    );
  }

  if (isFinished) {
    // In a real app, calculate score against correct answers. For now, mock score.
    const score = Object.keys(answers).length; 
    return (
      <div className="font-arabic py-12" dir="rtl">
        <ResultScreen 
          score={score} 
          total={questions.length} 
          onContinue={() => console.log('Continue to next step')} 
          onRetry={() => {
            setAnswers({});
            setCurrentIndex(0);
            setIsFinished(false);
          }}
        />
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

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
                  selected={answers[currentQ.id] === choice}
                  onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: choice }))}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 hover:bg-white/10 text-white"
        >
          <ChevronRight className="w-5 h-5" />
          <span>السابق</span>
        </button>
        
        <button 
          onClick={() => {
            if (currentIndex === questions.length - 1) {
              setIsFinished(true);
            } else {
              setCurrentIndex(prev => prev + 1);
            }
          }}
          disabled={!answers[currentQ.id]}
          className="px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-orange-500 hover:bg-orange-600 text-white glow-orange"
        >
          <span>{currentIndex === questions.length - 1 ? 'إنهاء' : 'التالي'}</span>
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
