import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { contentRepository } from '../services/content/contentRepository';
import { contentParser } from '../features/modules/utils/contentParser';
import { ModuleHeader } from '../features/modules/components/hierarchy/ModuleHeader';
import { LessonContainer } from '../features/modules/components/hierarchy/LessonContainer';
import { useLearningProgress } from '../hooks/useLearningProgress';
import { learningPath } from '../data/learningPath';

export function ModulePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const data = contentRepository.getModule(id || '');
  const [isLoading, setIsLoading] = useState(true);
  const { modules, visitModule, completeModule } = useLearningProgress();
  const moduleId = id?.replace('module-', 'm') || '';

  // Parse the data once
  const parsedModule = useMemo(() => {
    if (!data) return null;
    return contentParser(data);
  }, [data]);

  useEffect(() => {
    if (moduleId) visitModule(moduleId);
  }, [moduleId, visitModule]);

  // Skeleton Loading Effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [id]);

  const moduleNodes = useMemo(() => learningPath.filter((node) => node.type === 'module'), []);
  const currentModuleIndex = moduleNodes.findIndex((node) => node.moduleId === moduleId);
  const nextModule = currentModuleIndex >= 0 ? moduleNodes[currentModuleIndex + 1] : undefined;
  const quizIds = parsedModule?.lessons
    .filter((lesson) => lesson.assessments.length > 0)
    .map((lesson) => `${lesson.id}-quiz`) ?? [];
  const completedQuizzes = modules[moduleId]?.completedQuizzes ?? {};
  const allLessonQuizzesCompleted = quizIds.every((quizId) => completedQuizzes[quizId]);
  const completedLessonQuizCount = quizIds.filter((quizId) => completedQuizzes[quizId]).length;

  const handleCompleteModule = () => {
    completeModule(moduleId);
    if (nextModule?.id) {
      navigate(`/module/${nextModule.id}`);
      return;
    }
    navigate('/assessment/post-test');
  };

  if (isLoading || !parsedModule) {
    return (
      <main className="relative w-full pb-32">
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 pt-8">
          <div className="w-32 h-8 bg-white/5 rounded-lg animate-pulse mb-12" />
          <div className="w-full h-40 bg-orange-500/10 rounded-3xl animate-pulse border border-orange-500/20 mb-12" />
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-full h-24 bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full pb-32">
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 pt-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors mb-12 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform rotate-180" />
          <span className="font-arabic">العودة للرئيسية</span>
        </button>

        <ModuleHeader moduleData={parsedModule} />

        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>تقدم القراءة</span>
            <span>{modules[moduleId]?.percent ?? 0}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: `${modules[moduleId]?.percent ?? 0}%` }} />
          </div>
        </div>

        <div className="space-y-module">
          {parsedModule.lessons.map(lesson => (
            <LessonContainer key={lesson.id} moduleId={moduleId || parsedModule.id} lesson={lesson} totalSections={parsedModule.lessons.length} />
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-orange-500/25 bg-orange-500/10 p-6 md:p-8 text-right">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-orange-400 mb-2">نهاية الموديول</p>
              <h2 className="text-2xl font-bold text-white mb-2">
                {allLessonQuizzesCompleted ? 'جاهز للانتقال للخطوة التالية' : 'أكمل تقويمات الدروس أولاً'}
              </h2>
              <p className="text-gray-300 leading-8">
                {quizIds.length > 0
                  ? `تم تسليم ${completedLessonQuizCount} من ${quizIds.length} تقويم داخل هذا الموديول.`
                  : 'لا توجد تقويمات داخلية في هذا الموديول، يمكنك إنهاؤه مباشرة.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCompleteModule}
              disabled={!allLessonQuizzesCompleted}
              className="rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white shadow-[0_0_22px_rgba(249,115,22,0.28)] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {nextModule ? 'إنهاء الموديول والانتقال للتالي' : 'إنهاء المسار والانتقال للاختبار البعدي'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
