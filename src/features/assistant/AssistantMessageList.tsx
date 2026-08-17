import { useEffect, useRef } from 'react';
import { type AssistantMessage } from './types';
import { cn } from '../../lib/utils';
import { Bot, User, ArrowLeft, Lock, BookOpen } from 'lucide-react';
import { useSourceNavigation } from './hooks/useSourceNavigation';

interface AssistantMessageListProps {
  messages: AssistantMessage[];
  isLoading: boolean;
  isError: boolean;
  onNavigate?: () => void;
}

export function AssistantMessageList({ messages, isLoading, isError, onNavigate }: AssistantMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { checkIsLocked, navigateToSource } = useSourceNavigation(onNavigate);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isError]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-5 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
    >
      {/* Empty State */}
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Bot className="w-8 h-8 text-orange-500/60" />
          </div>
          <div>
            <p className="text-white/80 font-arabic text-base font-semibold mb-1">اسأل عن أي مفهوم</p>
            <p className="text-gray-500 font-arabic text-sm leading-relaxed">يمكنني مساعدتك في إيجاد المحتوى التعليمي المناسب</p>
          </div>
        </div>
      ) : (
        messages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex gap-2.5 items-end",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "shrink-0 w-7 h-7 rounded-xl flex items-center justify-center mb-0.5",
              msg.role === 'user' 
                ? "bg-white/10 text-gray-300" 
                : "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
            )}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            
            {/* Bubble */}
            <div className={cn(
              "max-w-[82%] font-arabic text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-orange-500/15 border border-orange-500/20 text-white rounded-2xl rounded-br-sm px-4 py-2.5" 
                : "text-gray-200 flex flex-col gap-3"
            )}>
              {/* Main text content */}
              <div className={cn(
                msg.role === 'assistant' && "bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-bl-sm px-4 py-2.5"
              )}>
                {msg.content}
              </div>

              {/* Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                    <BookOpen className="w-3 h-3 text-orange-400/70 shrink-0" />
                    <span className="text-orange-400/70 text-[11px] font-bold uppercase tracking-widest">المصادر ذات الصلة</span>
                  </div>
                  {msg.sources.map((source, idx) => {
                    const isLocked = checkIsLocked(source);
                    return (
                      <div key={idx} className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
                        {/* Source excerpt */}
                        <div className="px-3 py-2.5">
                          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 font-arabic">
                            {source.content}
                          </p>
                        </div>
                        
                        {/* Source metadata + nav */}
                        <div className="flex items-center justify-between gap-2 px-3 py-2 bg-black/20 border-t border-white/5">
                          <div className="text-[11px] font-arabic flex flex-col gap-0.5 min-w-0">
                            <span className="text-orange-400/80 font-medium truncate">{source.lessonTitle}</span>
                            {source.sectionTitle && (
                              <span className="text-gray-500 truncate">{source.sectionTitle}</span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => navigateToSource(source)}
                            disabled={isLocked}
                            title={isLocked ? 'هذا المحتوى مغلق حتى تنهي الدروس السابقة' : 'الذهاب إلى المصدر'}
                            className={cn(
                              "shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold font-arabic transition-all duration-200 whitespace-nowrap",
                              isLocked 
                                ? "text-gray-600 bg-white/5 cursor-not-allowed"
                                : "text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 hover:-translate-x-0.5 cursor-pointer"
                            )}
                          >
                            {isLocked ? (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>مغلق</span>
                              </>
                            ) : (
                              <>
                                <span>اذهب</span>
                                <ArrowLeft className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex gap-2.5 items-end flex-row">
          <div className="shrink-0 w-7 h-7 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex justify-center">
          <div className="bg-red-500/8 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl font-arabic text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>تعذر تنفيذ الطلب. حاول مرة أخرى.</span>
          </div>
        </div>
      )}
    </div>
  );
}
