import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './features/landing';

import { AnimatedBackground } from './shared/components/AnimatedBackground';
import { useLearningProgress } from './hooks/useLearningProgress';

const AboutPlatform = lazy(() => import('./pages/AboutPlatform').then(module => ({ default: module.AboutPlatform })));
const ModulePage = lazy(() => import('./pages/ModulePage').then(module => ({ default: module.ModulePage })));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage').then(module => ({ default: module.AssessmentPage })));
const StatsPage = lazy(() => import('./pages/StatsPage').then(module => ({ default: module.StatsPage })));

function App() {
  const { addLearningSeconds } = useLearningProgress();

  useEffect(() => {
    const interval = window.setInterval(() => addLearningSeconds(15), 15000);
    return () => window.clearInterval(interval);
  }, [addLearningSeconds]);

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-arabic selection:bg-orange-500/30 overflow-x-hidden" dir="rtl">
      <AnimatedBackground />
      <div className="relative z-10">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPlatform />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/module/:id" element={<ModulePage />} />
            <Route path="/assessment/:type" element={<AssessmentPage />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
