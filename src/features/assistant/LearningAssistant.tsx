import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X, MessageCircle } from 'lucide-react';
import { type AssistantMessage } from './types';
import { AssistantHeader } from './AssistantHeader';
import { AssistantMessageList } from './AssistantMessageList';
import { AssistantInput } from './AssistantInput';
import { searchContent } from '../../services/retrieval/retrievalService';

export function LearningAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const location = useLocation();

  // Hide the assistant on assessment and final results pages to prevent cheating/distraction
  const hideOnRoutes = ['/assessment', '/final-results'];
  const shouldHide = hideOnRoutes.some(route => location.pathname.startsWith(route));

  if (shouldHide) return null;

  const handleSend = (content: string) => {
    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsError(false);

    setTimeout(() => {
      try {
        const results = searchContent(content, { limit: 3 });

        if (results.length === 0) {
          const noResultMessage: AssistantMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'لم أجد محتوى واضحًا مرتبطًا بسؤالك داخل مواد التدريب. جرّب صياغة السؤال بطريقة أخرى.'
          };
          setMessages(prev => [...prev, noResultMessage]);
        } else {
          const assistantMessage: AssistantMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'وجدت هذا المحتوى المرتبط بسؤالك:',
            sources: results.map(r => r.document)
          };
          setMessages(prev => [...prev, assistantMessage]);
        }
      } catch (err) {
        console.error('Retrieval error:', err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const hasUnread = !isOpen && messages.length > 0;

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50" dir="rtl">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-[4.75rem] left-0 w-[calc(100vw-2rem)] sm:w-[420px] h-[540px] max-h-[calc(100vh-130px)] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.6)] origin-bottom-left animate-in fade-in zoom-in-95 duration-200"
          style={{ background: 'rgba(10,10,14,0.92)', backdropFilter: 'blur(24px)' }}
        >
          <AssistantHeader isSearching={isLoading} onClose={() => setIsOpen(false)} />
          <AssistantMessageList 
            messages={messages} 
            isLoading={isLoading} 
            isError={isError} 
            onNavigate={() => setIsOpen(false)}
          />
          <AssistantInput 
            onSend={handleSend} 
            isLoading={isLoading} 
          />
        </div>
      )}

      {/* Floating Launcher */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'إغلاق مساعد التدريب' : 'فتح مساعد التدريب'}
        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 ${
          isOpen
            ? 'bg-white/10 hover:bg-white/15 scale-100'
            : 'bg-orange-500 hover:bg-orange-400 hover:scale-105 shadow-[0_4px_24px_rgba(249,115,22,0.35)]'
        } ${!isOpen && isLoading ? 'shadow-[0_4px_32px_rgba(249,115,22,0.6)] animate-pulse' : ''}`}
      >
        {/* Unread dot */}
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 border-2 border-black text-[9px] font-bold text-white flex items-center justify-center">
            {messages.filter(m => m.role === 'assistant').length}
          </span>
        )}
        <div className={`transition-all duration-300 ${isOpen ? 'rotate-0 scale-100' : 'rotate-0 scale-100'}`}>
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </div>
      </button>
    </div>
  );
}
