import { useParams, useNavigate } from 'react-router-dom';
import { AssessmentRenderer } from '../features/assessments/AssessmentRenderer';
import { ChevronLeft } from 'lucide-react';


export function AssessmentPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  // Pass the route param directly as the assessmentId
  const assessmentId = type || 'pre-test';

  return (
    <main className="relative w-full pb-20">
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors mb-12 group"
          dir="rtl"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform rotate-180" />
          <span>العودة للمسار التعليمي</span>
        </button>

        <AssessmentRenderer assessmentId={assessmentId} />
      </div>
    </main>
  );
}
