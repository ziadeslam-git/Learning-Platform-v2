import type { ParsedAssessment } from '../../utils/contentParser';
import { CheckCircle2, HelpCircle } from 'lucide-react';
import { useLearningProgress } from '../../../../hooks/useLearningProgress';

interface Props {
  moduleId: string;
  lessonId: string;
  assessments: ParsedAssessment[];
  onCompleted?: () => void;
}

export function QuizComponent({ moduleId, lessonId, assessments, onCompleted }: Props) {
  const { modules, setQuizAnswer, markQuizCompleted } = useLearningProgress();
  const moduleProgress = modules[moduleId];
  const answers = moduleProgress?.quizAnswers ?? {};
  const quizId = `${lessonId}-quiz`;
  const submitted = Boolean(moduleProgress?.completedQuizzes?.[quizId]);
  const gradable = assessments.filter((item) => item.correctAnswer);
  const correctCount = gradable.filter((item) => answers[item.id] === item.correctAnswer).length;
  const wrongCount = gradable.length - correctCount;
  const percentage = gradable.length > 0 ? Math.round((correctCount / gradable.length) * 100) : 0;
  const requiredAssessments = assessments.filter((item) => item.type !== 'task');
  const answeredCount = requiredAssessments.filter((item) => answers[item.id]).length;
  const canSubmit = answeredCount === requiredAssessments.length;

  const handleSelect = (id: string, ans: string) => {
    if (submitted) return;
    setQuizAnswer(moduleId, id, ans);
  };

  const handleSubmit = () => {
    markQuizCompleted(moduleId, quizId);
    onCompleted?.();
  };

  return (
    <div className="bg-purple-500/10 border border-purple-500/20 rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-element text-purple-400">
        <HelpCircle className="w-8 h-8" />
        <h3 className="text-2xl font-bold font-arabic">التقويم</h3>
      </div>
      
      <div className="space-y-section">
        {assessments.map((quiz, i) => {
          const selected = answers[quiz.id];
          const isCorrect = quiz.correctAnswer ? selected === quiz.correctAnswer : null;
          return (
          <div key={quiz.id} className="bg-black/40 p-5 rounded-2xl border border-white/5">
            <p className="text-lg text-white font-arabic mb-element font-semibold">{i+1}. {quiz.text}</p>
            
            {quiz.type === 'mcq' && quiz.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quiz.options.map((opt, j) => (
                  <button 
                    key={j} 
                    onClick={() => handleSelect(quiz.id, opt)}
                    className={`text-right p-3 rounded-xl border transition-colors font-arabic ${
                      selected === opt
                        ? submitted && quiz.correctAnswer
                          ? opt === quiz.correctAnswer
                            ? 'bg-green-500/15 border-green-500/60 text-green-200'
                            : 'bg-red-500/15 border-red-500/60 text-red-200'
                          : 'bg-purple-500/20 border-purple-500 text-purple-200'
                        : submitted && opt === quiz.correctAnswer
                          ? 'bg-green-500/10 border-green-500/40 text-green-200'
                          : 'bg-white/5 border-white/10 hover:border-purple-500/30 text-gray-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            
            {quiz.type === 'tf' && (
              <div className="flex gap-4">
                {['صواب', 'خطأ'].map((opt) => (
                   <button 
                     key={opt}
                     onClick={() => handleSelect(quiz.id, opt)}
                     className={`flex-1 text-center p-3 rounded-xl border transition-colors font-arabic ${
                       selected === opt
                         ? submitted && quiz.correctAnswer
                           ? opt === quiz.correctAnswer
                             ? 'bg-green-500/15 border-green-500/60 text-green-200'
                             : 'bg-red-500/15 border-red-500/60 text-red-200'
                           : 'bg-purple-500/20 border-purple-500 text-purple-200'
                         : submitted && opt === quiz.correctAnswer
                           ? 'bg-green-500/10 border-green-500/40 text-green-200'
                           : 'bg-white/5 border-white/10 hover:border-purple-500/30 text-gray-300'
                     }`}
                   >
                     {opt}
                   </button>
                ))}
              </div>
            )}
            
            {quiz.type === 'task' && (
               <div className="bg-white/5 p-4 rounded-xl text-gray-400 text-sm font-arabic">مهمة أدائية - تتطلب تقييماً خارجياً</div>
            )}

            {submitted && (
              <div className={`mt-4 rounded-xl border p-3 text-sm font-arabic ${
                isCorrect === true
                  ? 'border-green-500/30 bg-green-500/10 text-green-300'
                  : isCorrect === false
                    ? 'border-red-500/30 bg-red-500/10 text-red-300'
                    : 'border-white/10 bg-white/5 text-gray-300'
              }`}>
                {quiz.correctAnswer ? (
                  <span>الإجابة الصحيحة: {quiz.correctAnswer}</span>
                ) : (
                  <span>تم تسجيل الإجابة. لا يوجد مفتاح إجابة موثق لهذا السؤال داخل المصدر الحالي.</span>
                )}
              </div>
            )}
          </div>
        );
        })}
      </div>

      {!submitted ? (
        <button 
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="mt-8 px-8 py-3 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors w-full sm:w-auto"
        >
          تسليم الإجابات
        </button>
      ) : (
        <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center">
          <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
           <h4 className="text-green-400 font-bold text-xl font-arabic mb-2">
             تم تسجيل نتيجة التقويم
           </h4>
           <p className="text-green-200/70 font-arabic">
             {gradable.length > 0
               ? `درجتك في الأسئلة الموثقة: ${correctCount} من ${gradable.length} - ${percentage}%، والإجابات الخاطئة: ${wrongCount}.`
               : 'تم حفظ إجاباتك، ولا توجد إجابات صحيحة موثقة لهذا التقويم داخل المصدر الحالي.'}
           </p>
           {gradable.length < assessments.length && (
             <p className="mt-2 text-xs text-gray-400 font-arabic">
               تم تسجيل {assessments.length - gradable.length} بند بدون تصحيح آلي لأنه لا يملك مفتاح إجابة موثق داخل المحتوى.
             </p>
           )}
        </div>
      )}
    </div>
  );
}
