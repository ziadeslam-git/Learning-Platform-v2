import { Bot, X, Sparkles } from 'lucide-react';

interface AssistantHeaderProps {
  isSearching?: boolean;
  onClose: () => void;
}

export function AssistantHeader({ isSearching, onClose }: AssistantHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-gradient-to-b from-white/[0.06] to-transparent shrink-0">
      {/* Avatar */}
      <div className={`relative w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shrink-0 transition-all duration-500 ${isSearching ? 'shadow-orange-500/40 shadow-[0_0_20px]' : 'shadow-orange-500/20'}`}>
        <Bot className={`w-5 h-5 transition-all duration-300 ${isSearching ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`} style={{ position: 'absolute' }} />
        <Sparkles className={`w-5 h-5 transition-all duration-300 ${isSearching ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`} style={{ position: 'absolute' }} />
        {isSearching && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-400 border-2 border-black animate-pulse" />
        )}
      </div>

      {/* Title & Status */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-white font-arabic leading-tight">مساعد التدريب</h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${isSearching ? 'bg-orange-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="text-xs text-gray-400 font-arabic truncate">
            {isSearching ? 'جاري البحث في المحتوى...' : 'جاهز لمساعدتك'}
          </span>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200"
        aria-label="إغلاق مساعد التدريب"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
