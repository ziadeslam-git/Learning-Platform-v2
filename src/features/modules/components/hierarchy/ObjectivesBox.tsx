import { Target } from 'lucide-react';

export function ObjectivesBox({ objectives }: { objectives: string[] }) {
  return (
    <div className="bg-blue-500/10 border border-blue-500/20 p-6 md:p-8 rounded-3xl mb-section">
      <div className="flex items-center gap-4 mb-element text-blue-400">
        <Target className="w-8 h-8" />
        <h3 className="text-xl font-bold font-arabic">الأهداف التعليمية</h3>
      </div>
      <p className="text-gray-300 mb-element font-arabic">بعد دراسة هذا الدرس يصبح المتدرب قادراً على أن:</p>
      <ol className="list-decimal list-inside space-y-text text-gray-200 text-lg font-arabic marker:text-blue-400">
        {objectives.map((obj, i) => (
          <li key={i} className="pl-2 leading-relaxed">{obj}</li>
        ))}
      </ol>
    </div>
  );
}
