import { motion } from 'framer-motion';

interface Props {
  lessonIndex: number;
  totalLessons: number;
  stepIndex: number;
  totalSteps: number;
  completedSteps: string[];
  stepIds: string[];
  lessonTitle: string;
  onGoToStep?: (stepIndex: number) => void;
}

export function StepProgressBar({
  lessonIndex,
  totalLessons,
  stepIndex,
  totalSteps,
  completedSteps,
  stepIds,
  lessonTitle,
  onGoToStep,
}: Props) {
  return (
    <div className="mb-8 p-4 rounded-2xl bg-white/3 border border-white/8">
      {/* Lesson label */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
            الدرس {lessonIndex + 1} من {totalLessons}
          </span>
          <span className="text-xs text-gray-600">—</span>
          <span className="text-xs text-gray-400 font-arabic truncate max-w-[180px] sm:max-w-none">{lessonTitle}</span>
        </div>
        <span className="text-xs text-gray-500">
          خطوة {stepIndex + 1} / {totalSteps}
        </span>
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {stepIds.map((id, idx) => {
          const isCompleted = completedSteps.includes(id);
          const isCurrent = idx === stepIndex;
          const completedInThisLesson = stepIds.filter(stepId => completedSteps.includes(stepId)).length;
          const isUnlocked = idx <= completedInThisLesson;
          const canNavigate = isUnlocked && onGoToStep;

          return (
            <motion.button
              key={id}
              onClick={() => canNavigate && onGoToStep(idx)}
              disabled={!canNavigate}
              className={`h-2 rounded-full transition-all ${
                isCurrent
                  ? 'w-6 bg-orange-500'
                  : isCompleted
                  ? 'w-3 bg-green-500/70 cursor-pointer hover:bg-green-400'
                  : isUnlocked
                  ? 'w-3 bg-white/40 cursor-pointer hover:bg-white/60'
                  : 'w-3 bg-white/15 cursor-not-allowed'
              }`}
              initial={false}
              animate={{ width: isCurrent ? 24 : 12 }}
              transition={{ duration: 0.25 }}
              title={isCurrent ? 'الخطوة الحالية' : isCompleted ? 'مكتملة — اضغط للمراجعة' : isUnlocked ? 'متاحة — اضغط للمتابعة' : 'غير متاحة بعد'}
            />
          );
        })}
      </div>
    </div>
  );
}
