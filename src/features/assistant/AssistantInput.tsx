import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowUp } from 'lucide-react';

interface AssistantInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function AssistantInput({ onSend, isLoading }: AssistantInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <div className="px-4 pb-4 pt-3 border-t border-white/[0.06] shrink-0">
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 focus-within:border-orange-500/50 focus-within:bg-white/[0.07] transition-all duration-200"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={isLoading}
          placeholder="اكتب سؤالك عن محتوى التدريب..."
          className="flex-1 bg-transparent border-none outline-none resize-none text-white font-arabic text-sm placeholder:text-gray-600 disabled:opacity-40 leading-relaxed py-1 max-h-[120px] scrollbar-thin scrollbar-thumb-white/10"
          dir="auto"
          rows={1}
        />
        <button
          type="submit"
          disabled={!canSend}
          className={`shrink-0 mb-0.5 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
            canSend
              ? 'bg-orange-500 text-white hover:bg-orange-400 shadow-lg shadow-orange-500/30'
              : 'bg-white/5 text-gray-600 cursor-not-allowed'
          }`}
          aria-label="إرسال"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </form>
      <p className="text-center text-[10px] text-gray-700 mt-2 font-arabic">
        اضغط Enter للإرسال · Shift+Enter لسطر جديد
      </p>
    </div>
  );
}
