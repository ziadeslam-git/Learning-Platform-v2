import { Hero } from '../hero';
import { Timeline } from '../timeline';
import { Footer } from '../footer';

import { Link } from 'react-router-dom';
import { BarChart3, Info, Play } from 'lucide-react';
import { useLearningProgress } from '../../hooks/useLearningProgress';

export function LandingPage() {
  const { lastModuleId, lastAssessmentId } = useLearningProgress();
  const resumeTarget = lastAssessmentId ? `/assessment/${lastAssessmentId}` : lastModuleId ? `/module/${lastModuleId}` : null;

  return (
    <main className="relative w-full">
      
      <header className="fixed top-0 left-0 w-full z-50 p-4 md:p-6 glass border-b-0 border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-row-reverse">
          <div className="font-bold text-xl tracking-widest text-white flex items-center gap-2 flex-row-reverse">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center glow-orange">
              <span className="text-white font-black text-lg">L</span>
            </div>
            <span className="hidden sm:inline-block uppercase tracking-wider font-sans">PLATFORM <span className="text-orange-500">v2</span></span>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3">
            {resumeTarget && (
              <Link
                to={resumeTarget}
                className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-xl transition-all glow-orange hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4" />
                <span className="font-semibold tracking-wide">متابعة من حيث توقفت</span>
              </Link>
            )}
            <Link
              to="/stats"
              className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 rounded-xl transition-all hover:-translate-y-0.5"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-semibold tracking-wide">الإحصائيات</span>
            </Link>
            <Link 
              to="/about"
              className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-xl transition-all glow-orange hover:-translate-y-0.5"
            >
              <Info className="w-4 h-4" />
              <span className="font-semibold tracking-wide">عن المنصة</span>
            </Link>
          </div>
        </div>
      </header>

      <Hero />
      <Timeline />
      <Footer />
    </main>
  );
}
