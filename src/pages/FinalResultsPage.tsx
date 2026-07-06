import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2, TrendingDown, TrendingUp, RotateCcw, Home, BarChart, GraduationCap, HeartHandshake } from 'lucide-react';
import { useAssessmentStore } from '../stores/assessment.store';
import { useProgressStore } from '../stores/progress.store';
import { contentRepository } from '../services/content/contentRepository';
import { parseAssessmentQuestions } from '../features/assessments/utils/assessmentParser';
import { contentParser } from '../features/modules/utils/contentParser';
import { gradeAssessment } from '../features/assessments/utils/grading';
import { cn } from '../lib/utils';
import { learningPath } from '../data/learningPath';

const getModuleScore = (moduleId: string, quizAnswers: Record<string, string>) => {
  const moduleData = contentRepository.getModule(moduleId);
  if (!moduleData) return { score: 0, total: 0, percent: 0 };
  
  const parsedModule = contentParser(moduleData);
  let score = 0;
  let total = 0;

  for (const lesson of parsedModule.lessons) {
    for (const quiz of lesson.assessments) {
      if (quiz.correctAnswer) {
        total++;
        if (quizAnswers[quiz.id] === quiz.correctAnswer) {
          score++;
        }
      }
    }
  }

  const percent = total > 0 ? (score / total) * 100 : 0;
  return { score, total, percent };
};

export function FinalResultsPage() {
  const navigate = useNavigate();
  const { attempts, resetAll: resetAssessments } = useAssessmentStore();
  const { modules, resetAll: resetProgress } = useProgressStore();

  const getAssessmentResult = (id: string) => {
    const attempt = attempts[id];
    if (!attempt || !attempt.finishedAt) return null;
    const data = contentRepository.getAssessment(id);
    if (!data) return null;
    const questions = parseAssessmentQuestions(data);
    return gradeAssessment(id, questions, attempt);
  };

  const preTest = useMemo(() => getAssessmentResult('pre-test'), [attempts]);
  const postTest = useMemo(() => getAssessmentResult('post-test'), [attempts]);
  
  const preScale = useMemo(() => getAssessmentResult('pre-scale'), [attempts]);
  const postScale = useMemo(() => getAssessmentResult('post-scale'), [attempts]);

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من إعادة البرنامج؟ سيتم مسح جميع الإحصائيات والدرجات وإعادة البرنامج من البداية.')) {
      resetAssessments();
      resetProgress();
      navigate('/');
    }
  };

  const getStatusText = (percent: number) => {
    if (percent >= 80) return 'ممتاز';
    if (percent >= 65) return 'جيد جداً';
    if (percent >= 50) return 'جيد';
    return 'يحتاج تحسين';
  };

  const getStatusColor = (percent: number) => {
    if (percent >= 80) return 'text-green-400';
    if (percent >= 65) return 'text-blue-400';
    if (percent >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const renderComparisonSection = (
    title: string, 
    icon: React.ReactNode, 
    pre: ReturnType<typeof getAssessmentResult>, 
    post: ReturnType<typeof getAssessmentResult>,
    maxFallback: number
  ) => {
    const preScore = pre?.score ?? 0;
    const preTotal = pre?.gradedTotal ?? maxFallback;
    const prePercent = pre?.percent ?? 0;

    const postScore = post?.score ?? 0;
    const postTotal = post?.gradedTotal ?? maxFallback;
    const postPercent = post?.percent ?? 0;

    const diff = postPercent - prePercent;
    const isImprovement = diff > 0;
    const isNeutral = diff === 0;

    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-orange-400 border border-white/10">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-gray-400 font-bold mb-2">الاختبار القبلي</h3>
            <div className="text-5xl font-black text-white mb-2">{Math.round(prePercent)}<span className="text-2xl text-gray-500">%</span></div>
            <p className={cn("font-bold text-lg mb-1", getStatusColor(prePercent))}>{getStatusText(prePercent)}</p>
            <p className="text-sm text-gray-500">{preScore} / {preTotal} نقطة</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 text-blue-400 border border-blue-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-gray-400 font-bold mb-2">الاختبار البعدي</h3>
            <div className="text-5xl font-black text-white mb-2">{Math.round(postPercent)}<span className="text-2xl text-gray-500">%</span></div>
            <p className={cn("font-bold text-lg mb-1", getStatusColor(postPercent))}>{getStatusText(postPercent)}</p>
            <p className="text-sm text-gray-500">{postScore} / {postTotal} نقطة</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className={cn(
              "absolute inset-0 pointer-events-none opacity-20",
              isImprovement ? "bg-gradient-to-t from-green-500/40" : isNeutral ? "" : "bg-gradient-to-b from-red-500/40"
            )} />
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border",
              isImprovement ? "bg-green-500/20 text-green-400 border-green-500/30" : isNeutral ? "bg-white/5 text-gray-400 border-white/10" : "bg-red-500/20 text-red-400 border-red-500/30"
            )}>
              {isImprovement ? <TrendingUp className="w-6 h-6" /> : isNeutral ? <TrendingUp className="w-6 h-6 rotate-90 opacity-50" /> : <TrendingDown className="w-6 h-6" />}
            </div>
            <h3 className="text-gray-400 font-bold mb-2">نسبة التحسن</h3>
            <div className={cn(
              "text-5xl font-black mb-2 flex items-center gap-1 flex-row-reverse",
              isImprovement ? "text-green-400" : isNeutral ? "text-gray-400" : "text-red-400"
            )}>
              <span>{Math.round(Math.abs(diff))}</span>
              <span className="text-3xl">{diff < 0 ? '-' : diff > 0 ? '+' : ''}</span>
            </div>
            <p className={cn(
              "font-bold text-lg",
              isImprovement ? "text-green-400/80" : isNeutral ? "text-gray-500" : "text-red-400/80"
            )}>
              {isImprovement ? 'تقدم' : isNeutral ? 'لا يوجد تغيير' : 'تراجع'}
            </p>
          </motion.div>
        </div>

        {/* Visual Comparison for this section */}
        <div className="glass rounded-3xl p-6 md:p-8 border border-white/5">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-300 mb-2">
                <span>الاختبار القبلي</span>
                <span>{Math.round(prePercent)}%</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex flex-row-reverse">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${prePercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gray-500 rounded-full"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-300 mb-2">
                <span>الاختبار البعدي</span>
                <span>{Math.round(postPercent)}%</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex flex-row-reverse">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${postPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={cn("h-full rounded-full bg-gradient-to-l", isImprovement ? "from-green-400 to-green-600" : isNeutral ? "from-gray-400 to-gray-500" : "from-red-400 to-orange-500")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const moduleNodes = learningPath.filter(n => n.type === 'module');

  return (
    <div className="min-h-screen bg-black font-arabic p-6 md:p-12 relative overflow-hidden text-gray-200" dir="rtl">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:40px_40px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 pt-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-4 border border-white/10">
            <BarChart className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            النتائج الشاملة للبرنامج
          </h1>
          <p className="text-gray-400 text-lg">
            مقارنة دقيقة للأداء الفعلي ومستوى التطور
          </p>
        </motion.div>

        {renderComparisonSection('التحصيل المعرفي', <GraduationCap className="w-6 h-6" />, preTest, postTest, 50)}
        {renderComparisonSection('مقياس التقبل التكنولوجي', <HeartHandshake className="w-6 h-6" />, preScale, postScale, 100)}

        {/* Module Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-6 md:p-8 border border-white/5 mb-12"
        >
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white">درجات التقويم البنائي للموديولات</h2>
            <span className="text-sm text-gray-400">بناءً على الإجابات الصحيحة للتقويمات المستمرة</span>
          </div>
          
          <div className="space-y-4">
            {moduleNodes.map((node, idx) => {
              const moduleId = node.moduleId;
              const moduleData = moduleId ? modules[moduleId] : null;
              
              // Calculate actual module score from quizAnswers
              const quizAnswers = moduleData?.quizAnswers ?? {};
              const { score, total, percent } = moduleId ? getModuleScore(moduleId, quizAnswers) : { score: 0, total: 0, percent: 0 };
              
              return (
                <div key={node.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0 border border-orange-500/20">
                    <span className="font-black text-lg">{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between">
                    <h4 className="font-bold text-gray-200 truncate ml-4">{node.title}</h4>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <div className="text-sm text-gray-400 whitespace-nowrap">
                        {total > 0 ? `${score} / ${total} صحيحة` : 'لم يُختبر بعد'}
                      </div>
                      <div className="w-32 sm:w-48 h-1.5 bg-black/50 rounded-full overflow-hidden flex flex-row-reverse">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                          className="h-full bg-orange-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-black text-white shrink-0 tabular-nums w-14 text-left">
                    {Math.round(percent)}%
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-8 pb-12">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:-translate-y-1 text-white font-bold"
          >
            <Home className="w-5 h-5" />
            الرئيسية
          </button>
          
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-all hover:-translate-y-1 text-red-400 font-bold"
          >
            <RotateCcw className="w-5 h-5" />
            إعادة البرنامج بالكامل
          </button>
        </div>

      </div>
    </div>
  );
}
