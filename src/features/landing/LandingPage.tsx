import { Hero } from '../hero';
import { Timeline } from '../timeline';
import { Footer } from '../footer';
import { AnimatedBackground } from '../../shared/components/AnimatedBackground';

export function LandingPage() {
  return (
    <main className="relative min-h-screen w-full selection:bg-orange-500/30">
      <AnimatedBackground />
      
      {/* Top navigation / Logo area can be added here later if needed */}
      <header className="fixed top-0 left-0 w-full z-50 p-6 glass border-b-0 border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="font-bold text-xl tracking-widest text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center glow-orange">
              <span className="text-white font-black text-lg">L</span>
            </div>
            <span className="hidden sm:inline-block">PLATFORM <span className="text-orange-500">v2</span></span>
          </div>
        </div>
      </header>

      <Hero />
      <Timeline />
      <Footer />
    </main>
  );
}
