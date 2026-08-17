import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ParsedAssessment } from '../../utils/contentParser';
import type { ConceptGroup } from '../../utils/conceptGrouper';
import { useProgressStore } from '../../../../stores/progress.store';
import type { ActivityStatus } from '../../../../types/progress';

interface Props {
  group: ConceptGroup;
  stepId: string;
  moduleId: string;
  onNext: (result: 'correct' | 'incorrect') => void;
}

export function ActivityStep({ group, stepId, moduleId, onNext }: Props) {
  const persistedState = useProgressStore((s) => s.modules[moduleId]?.journeyState?.activityStates?.[stepId]);
  const setActivityState = useProgressStore((s) => s.setActivityState);

  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<ActivityStatus>(persistedState || 'idle');
  const [remediationAttempt, setRemediationAttempt] = useState<string | null>(null);
  const [retriesUsed, setRetriesUsed] = useState(0);

  // Keep store in sync
  useEffect(() => {
    if (state !== 'idle' && state !== persistedState) {
      setActivityState(moduleId, stepId, state);
    }
  }, [state, moduleId, stepId, setActivityState, persistedState]);

  const question: ParsedAssessment | null = group.activityQuestion;

  if (!question) {
    // No question available — should not happen if ConceptGroupView handles it, but guard anyway
    return null;
  }

  const choices: string[] =
    question.type === 'mcq' && question.options
      ? question.options
      : ['صواب', 'خطأ'];

  const checkAnswer = (answer: string): boolean =>
    question.correctAnswer ? answer === question.correctAnswer : false;

  const handleSubmit = () => {
    if (!selected) return;
    const correct = checkAnswer(selected);
    if (correct) {
      setState('correct');
    } else {
      setState('failed');
      setTimeout(() => setState('remediation-required'), 1500); // Transition to remediation
    }
  };



  const handleRemediationSubmit = () => {
    if (!remediationAttempt) return;
    const correct = checkAnswer(remediationAttempt);
    if (correct) {
      setState('remediation-completed');
    } else {
      // Anti-lock: After 1 failed retry, let the user pass
      if (retriesUsed >= 1) {
        setState('remediation-completed');
      } else {
        setRemediationAttempt(null);
        setRetriesUsed((r) => r + 1);
        // Briefly show failed before going back to remediation
        setState('failed');
        setTimeout(() => setState('remediation-required'), 1500);
      }
    }
  };

  const bgByState: Record<ActivityStatus, string> = {
    'idle': 'border-blue-500/20 bg-blue-500/5',
    'in-progress': 'border-blue-500/20 bg-blue-500/5',
    'correct': 'border-green-500/30 bg-green-500/8',
    'failed': 'border-red-500/30 bg-red-500/8',
    'remediation-required': 'border-amber-500/30 bg-amber-500/8',
    'remediation-completed': 'border-green-500/30 bg-green-500/8',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-3xl border p-6 md:p-8 transition-colors ${bgByState[state]}`}
    >
      {/* Activity header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-blue-300 font-arabic">نشاط تفاعلي</h3>
      </div>

      {/* Activity description if present */}
      {group.activityText && (
        <div className="mb-5 p-4 rounded-2xl bg-black/30 border border-white/5">
          <p className="text-gray-300 leading-relaxed font-arabic text-sm">{group.activityText}</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* IDLE / IN-PROGRESS */}
        {(state === 'idle' || state === 'in-progress') && (
          <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-white font-bold text-lg font-arabic mb-5 leading-relaxed">{question.text}</p>
            <div className={`grid gap-3 mb-6 ${question.type === 'tf' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {choices.map((opt) => {
                const isSelected = selected === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => { setSelected(opt); setState('in-progress'); }}
                    className={`text-right p-4 rounded-2xl border font-arabic text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-500/25 border-blue-400 text-blue-100 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-blue-500/40 hover:bg-blue-500/10'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!selected}
              className="flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg font-arabic transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              تحقق من إجابتي
            </button>
          </motion.div>
        )}

        {/* CORRECT / REMEDIATION COMPLETED */}
        {(state === 'correct' || state === 'remediation-completed') && (
          <motion.div key="correct" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} className="flex flex-col items-center text-center py-6 gap-4">
            {/* Success icon */}
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-green-500/15 border border-green-500/25 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Status text */}
            <div>
              <h4 className="text-green-400 font-bold text-xl mb-1 font-arabic">
                {state === 'remediation-completed' ? 'تم إكمال النشاط' : 'أحسنت! 🎉'}
              </h4>
              <p className="text-gray-400 text-sm font-arabic">
                {state === 'remediation-completed' ? 'تمكنت من الإجابة بعد المراجعة.' : 'إجابة صحيحة، استمر في التقدم.'}
              </p>
            </div>

            {/* Next button */}
            <button
              onClick={() => onNext(state === 'remediation-completed' ? 'incorrect' : 'correct')}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold transition-all hover:-translate-y-0.5 shadow-[0_0_24px_rgba(249,115,22,0.35)] font-arabic"
            >
              <span>التالي</span>
              <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* FAILED (Brief feedback before remediation) */}
        {state === 'failed' && (
          <motion.div key="failed" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
            <div className="flex justify-center items-center gap-3 mb-4">
              <h4 className="text-red-400 font-bold text-lg font-arabic">❌ الإجابة غير صحيحة</h4>
            </div>
            <p className="text-gray-300 font-arabic text-sm">جاري التوجيه للمراجعة...</p>
          </motion.div>
        )}

        {/* REMEDIATION REQUIRED */}
        {state === 'remediation-required' && (
          <motion.div key="remediation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="text-amber-400 font-bold text-lg font-arabic">راجع المفهوم السابق مرة أخرى ثم حاول مجددًا</h4>
            </div>

            {/* Remediation hint / Explanation */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-5">
              <p className="text-amber-200 text-sm font-arabic leading-relaxed">
                <span className="font-bold">💡 مراجعة سريعة: </span>
                تأكد من قراءة التفاصيل بعناية، الإجابة الصحيحة مرتبطة ارتباطًا وثيقًا بالنقاط الرئيسية المذكورة في المحتوى.
              </p>
            </div>

            {/* Remediation re-attempt question */}
            <p className="text-white font-bold text-base font-arabic mb-4 leading-relaxed">حاول مرة أخرى: {question.text}</p>
            <div className={`grid gap-3 mb-5 ${question.type === 'tf' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {choices.map((opt) => {
                const isSelected = remediationAttempt === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setRemediationAttempt(opt)}
                    className={`text-right p-4 rounded-2xl border font-arabic text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-500/25 border-amber-400 text-amber-100'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-amber-500/40 hover:bg-amber-500/10'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRemediationSubmit}
                disabled={!remediationAttempt}
                className="flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg font-arabic transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              >
                تأكيد الإجابة
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
