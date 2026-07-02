import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useLearningProgress } from '../hooks/useLearningProgress';

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} دقيقة و ${remainingSeconds} ثانية`;
}

function formatDate(value: string | null) {
  if (!value) return 'لا توجد زيارة محفوظة';
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function StatsPage() {
  const { getStats } = useLearningProgress();
  const stats = getStats();
  const items = [
    ['عدد الموديولات', stats.moduleCount],
    ['عدد المكتمل', stats.completedModuleCount],
    ['عدد الاختبارات', stats.assessmentCount],
    ['عدد الاختبارات المنتهية', stats.completedAssessmentCount],
    ['وقت التعلم', formatSeconds(stats.totalLearningSeconds)],
    ['آخر زيارة', formatDate(stats.lastVisitedAt)],
  ];

  return (
    <main className="relative w-full pb-20">
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-8">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors mb-12 group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform rotate-180" />
          <span>العودة للرئيسية</span>
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-orange-400 mb-10 font-arabic">الإحصائيات</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(([label, value]) => (
            <div key={label} className="glass border border-white/10 rounded-2xl p-6">
              <p className="text-gray-400 mb-2">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
