import type { ParsedModule } from '../../utils/contentParser';

export function ModuleHeader({ moduleData }: { moduleData: ParsedModule }) {
  return (
    <div className="mb-module">
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-orange-400 to-orange-600 mb-element font-arabic">
        {moduleData.title}
        {moduleData.subtitle && <span className="block mt-text text-2xl md:text-3xl font-semibold text-white/90">{moduleData.subtitle}</span>}
      </h1>
      
      {moduleData.generalObjective && (
        <div className="bg-orange-500/10 border-r-4 border-r-orange-500 p-6 rounded-2xl glass-orange">
          <h3 className="text-orange-400 font-bold mb-text">الهدف العام للموديول</h3>
          <p className="text-orange-100/90 text-lg leading-relaxed font-arabic">
            {moduleData.generalObjective}
          </p>
        </div>
      )}
    </div>
  );
}
