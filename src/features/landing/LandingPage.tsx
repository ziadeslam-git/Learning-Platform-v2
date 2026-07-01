import { Hero } from '../hero';
import { Timeline } from '../timeline';
import { Footer } from '../footer';
import { AnimatedBackground } from '../../shared/components/AnimatedBackground';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

export function LandingPage() {
  return (
    <main className="relative min-h-screen w-full selection:bg-orange-500/30 font-arabic" dir="rtl">
      <AnimatedBackground />
      
      <header className="fixed top-0 left-0 w-full z-50 p-6 glass border-b-0 border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-row-reverse">
          <div className="font-bold text-xl tracking-widest text-white flex items-center gap-2 flex-row-reverse">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center glow-orange">
              <span className="text-white font-black text-lg">L</span>
            </div>
            <span className="hidden sm:inline-block uppercase tracking-wider font-sans">PLATFORM <span className="text-orange-500">v2</span></span>
          </div>

          <Link 
            to="/about"
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-xl transition-all glow-orange hover:-translate-y-0.5"
          >
            <Info className="w-4 h-4" />
            <span className="font-semibold tracking-wide">عن المنصة</span>
          </Link>
        </div>
      </header>

      <Hero />
      <Timeline />
      <Footer />
    </main>
  );
}
