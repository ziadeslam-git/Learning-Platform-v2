import { useParams, useNavigate } from 'react-router-dom';
import { AssessmentRenderer } from '../features/assessments/AssessmentRenderer';
import { ChevronLeft } from 'lucide-react';
import { AnimatedBackground } from '../shared/components/AnimatedBackground';

export function AssessmentPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  // Map route params to the types expected by AssessmentRenderer
  const assessmentType = type === 'pre' ? 'pre' : type === 'post' ? 'post' : 'module';
  const assessmentId = assessmentType === 'pre' ? 'pre-assessment' : assessmentType === 'post' ? 'post-assessment' : `module-${type}`;

  return (
    <main className="relative min-h-screen w-full bg-black text-white font-arabic selection:bg-orange-500/30 overflow-x-hidden pb-20">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors mb-12 group"
          dir="rtl"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform rotate-180" />
          <span>العودة للرئيسية</span>
        </button>

        <AssessmentRenderer type={assessmentType} assessmentId={assessmentId} />
      </div>
    </main>
  );
}
