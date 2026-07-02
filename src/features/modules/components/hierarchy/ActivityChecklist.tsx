import { CheckSquare, Square } from 'lucide-react';
import { useLearningProgress } from '../../../../hooks/useLearningProgress';

export function ActivityChecklist({ moduleId, activities }: { moduleId: string; activities: string[] }) {
  const { modules, setChecklistItem } = useLearningProgress();
  const checked = modules[moduleId]?.checklist ?? {};

  const toggle = (i: number) => {
    const itemId = `activity-${i}`;
    setChecklistItem(moduleId, itemId, !checked[itemId]);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
      <h3 className="text-2xl font-bold text-green-400 mb-element font-arabic border-b border-white/10 pb-4">الأنشطة</h3>
      <div className="space-y-element">
        {activities.map((act, i) => (
          <label key={i} className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors ${checked[`activity-${i}`] ? 'bg-green-500/10 border border-green-500/20' : 'bg-black/30 hover:bg-white/5 border border-transparent'}`}>
             <div className="mt-1 shrink-0">
               {checked[`activity-${i}`] ? <CheckSquare className="w-6 h-6 text-green-400" /> : <Square className="w-6 h-6 text-gray-400" />}
             </div>
             <input type="checkbox" className="hidden" checked={checked[`activity-${i}`] || false} onChange={() => toggle(i)} />
             <span className={`text-lg leading-relaxed font-arabic transition-all ${checked[`activity-${i}`] ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
               {act}
             </span>
          </label>
        ))}
      </div>
    </div>
  );
}
