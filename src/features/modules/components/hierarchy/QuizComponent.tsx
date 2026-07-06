import type { ParsedAssessment } from '../../utils/contentParser';
import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
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

  // Only count gradable (has correct answer)
  const gradable = assessments.filter((item) => item.correctAnswer);
  const correctCount = gradable.filter((item) => answers[item.id] === item.correctAnswer).length;
  const wrongCount = gradable.length - correctCount;
  const percentage = gradable.length > 0 ? Math.round((correctCount / gradable.length) * 100) : 0;

  // Only require non-task answers to submit
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
              <p className="text-lg text-white font-arabic mb-4 font-semibold leading-relaxed">{i + 1}. {quiz.text}</p>

              {/* MCQ — 2 options per row */}
              {quiz.type === 'mcq' && quiz.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quiz.options.map((opt, j) => {
                    const isSelected = selected === opt;
                    const isRightAnswer = opt === quiz.correctAnswer;
                    let btnClass = 'text-right p-3 rounded-xl border transition-all font-arabic text-sm ';

                    if (submitted) {
                      if (isRightAnswer) {
                        btnClass += 'bg-green-500/15 border-green-500/60 text-green-200';
                      } else if (isSelected && !isRightAnswer) {
                        btnClass += 'bg-red-500/15 border-red-500/60 text-red-200';
                      } else {
                        btnClass += 'bg-white/3 border-white/10 text-gray-400';
                      }
                    } else {
                      btnClass += isSelected
                        ? 'bg-purple-500/20 border-purple-500 text-purple-100'
                        : 'bg-white/5 border-white/10 hover:border-purple-500/40 hover:bg-purple-500/10 text-gray-300 cursor-pointer';
                    }

                    return (
                      <button key={j} onClick={() => handleSelect(quiz.id, opt)} className={btnClass}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* True/False — 2 side by side */}
              {quiz.type === 'tf' && (
                <div className="grid grid-cols-2 gap-4">
                  {['صواب', 'خطأ'].map((opt) => {
                    const isSelected = selected === opt;
                    const isRightAnswer = opt === quiz.correctAnswer;
                    let btnClass = 'text-center p-3 rounded-xl border transition-all font-arabic font-bold ';

                    if (submitted) {
                      if (isRightAnswer) {
                        btnClass += 'bg-green-500/15 border-green-500/60 text-green-200';
                      } else if (isSelected && !isRightAnswer) {
                        btnClass += 'bg-red-500/15 border-red-500/60 text-red-200';
                      } else {
                        btnClass += 'bg-white/3 border-white/10 text-gray-400';
                      }
                    } else {
                      btnClass += isSelected
                        ? 'bg-purple-500/20 border-purple-500 text-purple-100'
                        : 'bg-white/5 border-white/10 hover:border-purple-500/40 hover:bg-purple-500/10 text-gray-300 cursor-pointer';
                    }

                    return (
                      <button key={opt} onClick={() => handleSelect(quiz.id, opt)} className={btnClass}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Practical task — display only */}
              {quiz.type === 'task' && (
                <div className="bg-white/5 p-4 rounded-xl text-gray-400 text-sm font-arabic leading-relaxed whitespace-pre-line">
                  {quiz.text}
                </div>
              )}

              {/* After submit: show correct answer for gradable questions only */}
              {submitted && quiz.correctAnswer && (
                <div className={`mt-4 rounded-xl border p-3 text-sm font-arabic flex items-center gap-2 ${
                  isCorrect === true
                    ? 'border-green-500/30 bg-green-500/10 text-green-300'
                    : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>الإجابة الصحيحة: <strong>{quiz.correctAnswer}</strong></span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit button or result summary */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="mt-8 px-8 py-3 bg-purple-500 hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors w-full sm:w-auto font-arabic"
        >
          تسليم الإجابات {canSubmit ? '' : `(${answeredCount}/${requiredAssessments.length})`}
        </button>
      ) : (
        <div className="mt-8 p-6 bg-black/30 border border-purple-500/20 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-400 shrink-0" />
            <h4 className="text-green-400 font-bold text-xl font-arabic">تم تسليم التقويم</h4>
          </div>
          {gradable.length > 0 && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-2xl font-bold text-white">{correctCount}/{gradable.length}</div>
                <div className="text-gray-400 text-xs font-arabic mt-1">الدرجة</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-2xl font-bold text-blue-400">{percentage}%</div>
                <div className="text-gray-400 text-xs font-arabic mt-1">النسبة</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-2xl font-bold text-red-400">{wrongCount}</div>
                <div className="text-gray-400 text-xs font-arabic mt-1">أخطاء</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
