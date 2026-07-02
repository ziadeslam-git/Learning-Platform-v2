import { useState } from 'react';
import type { ParsedAssessment } from '../../utils/contentParser';
import { HelpCircle } from 'lucide-react';

export function QuizComponent({ assessments }: { assessments: ParsedAssessment[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (id: string, ans: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: ans }));
  };

  // const score = assessments.filter(a => answers[a.id]).length;

  return (
    <div className="bg-purple-500/10 border border-purple-500/20 rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-element text-purple-400">
        <HelpCircle className="w-8 h-8" />
        <h3 className="text-2xl font-bold font-arabic">التقويم</h3>
      </div>
      
      <div className="space-y-section">
        {assessments.map((quiz, i) => (
          <div key={quiz.id} className="bg-black/40 p-6 rounded-2xl border border-white/5">
            <p className="text-lg text-white font-arabic mb-element font-semibold">{i+1}. {quiz.text}</p>
            
            {quiz.type === 'mcq' && quiz.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quiz.options.map((opt, j) => (
                  <button 
                    key={j} 
                    onClick={() => handleSelect(quiz.id, opt)}
                    className={`text-right p-3 rounded-xl border transition-colors font-arabic ${answers[quiz.id] === opt ? 'bg-purple-500/20 border-purple-500 text-purple-200' : 'bg-white/5 border-white/10 hover:border-purple-500/30 text-gray-300'}`}
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
                     className={`flex-1 text-center p-3 rounded-xl border transition-colors font-arabic ${answers[quiz.id] === opt ? 'bg-purple-500/20 border-purple-500 text-purple-200' : 'bg-white/5 border-white/10 hover:border-purple-500/30 text-gray-300'}`}
                   >
                     {opt}
                   </button>
                ))}
              </div>
            )}
            
            {quiz.type === 'task' && (
               <div className="bg-white/5 p-4 rounded-xl text-gray-400 text-sm font-arabic">مهمة أدائية - تتطلب تقييماً خارجياً</div>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button 
          onClick={() => setSubmitted(true)}
          className="mt-8 px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold transition-colors w-full sm:w-auto"
        >
          تسليم الإجابات
        </button>
      ) : (
        <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center">
           <h4 className="text-green-400 font-bold text-xl font-arabic mb-2">
             تم تسجيل إجاباتك بنجاح!
           </h4>
           <p className="text-green-200/70 font-arabic">
             سيتم استخراج وعرض النتيجة بمجرد اعتماد نموذج الإجابة (Answer Key) الخاص بهذا الاختبار.
           </p>
        </div>
      )}
    </div>
  );
}
