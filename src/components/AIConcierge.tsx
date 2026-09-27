import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';
import { askConcierge } from '../services/geminiConcierge';

interface MessageItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  time: string;
}

const SUGGESTED_CHIPS = [
  'Tell me about The Cliffside Villa',
  'What enclaves are in Azure Bay?',
  'How do I book a private viewing?',
  'What is the price of The Cliffside Villa?'
];

export const AIConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Good day. I am your Meridian Estates AI Concierge in Azure Bay. How may I assist your inquiry regarding The Cliffside Villa, our coastal enclaves, or private viewings?',
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isTyping) return;

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Build history for context
      const historyContext = messages.map((m) => ({
        role: m.role,
        text: m.text
      }));

      const reply = await askConcierge(query, historyContext);

      const aiMsg: MessageItem = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'model',
          text: 'Our private concierge desk is momentarily operating in offline mode. The Cliffside Villa is offered at PKR 28.5 Crore in Coral Ridge. Please feel free to schedule a private viewing or connect via WhatsApp.',
          time: 'Just now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      'Hello Meridian Estates Concierge, I would like to speak with a property director regarding acquisitions in Azure Bay.'
    );
    window.open(`https://wa.me/920000000000?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Concierge Popover Window */}
      {isOpen && (
        <div className="mb-3 w-84 sm:w-96 rounded-2xl bg-[#090a0f]/95 border border-[#C9A24B] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(201,162,75,0.25)] p-4 text-white animate-fadeIn backdrop-blur-2xl flex flex-col h-[480px]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#C9A24B]/20 mb-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#DFBF6D] to-[#C9A24B] flex items-center justify-center text-black shadow-[0_0_12px_rgba(201,162,75,0.4)]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-serif font-bold text-white">Meridian Concierge</h4>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C9A24B]/20 border border-[#C9A24B]/40 text-[#DFBF6D] font-mono">
                    AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#DFBF6D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] animate-pulse" />
                  <span>Azure Bay Resident Advisor</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={openWhatsApp}
                className="p-1.5 rounded-lg text-stone-400 hover:text-[#C9A24B] hover:bg-white/5 transition-colors cursor-pointer"
                title="Connect via WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close concierge"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs select-text">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                      isUser
                        ? 'bg-[#C9A24B] text-black font-medium rounded-br-xs shadow-md'
                        : 'bg-[#12141c] border border-white/10 text-stone-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] font-mono text-stone-500 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#12141c] border border-white/10 w-20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DFBF6D] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#DFBF6D] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#DFBF6D] animate-bounce" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Question Chips */}
          <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {SUGGESTED_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                disabled={isTyping}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#C9A24B]/15 hover:border-[#C9A24B]/40 border border-white/10 text-[10px] text-stone-300 hover:text-[#DFBF6D] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="pt-2 border-t border-white/10 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder="Ask about villas, prices, or viewings..."
              className="flex-1 px-3 py-2.5 text-xs rounded-xl bg-black/60 border border-[#C9A24B]/30 focus:border-[#C9A24B] focus:outline-none text-white placeholder-stone-500 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#DFBF6D] hover:from-[#b8913d] hover:to-[#ceaf5e] text-black flex items-center justify-center transition-all shrink-0 shadow-md cursor-pointer disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#090a0f] hover:bg-[#12141c] text-[#C9A24B] border-2 border-[#C9A24B] shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_24px_rgba(201,162,75,0.4)] hover:shadow-[0_8px_36px_rgba(201,162,75,0.65)] flex items-center justify-center transition-all duration-300 transform hover:scale-105 group cursor-pointer"
        aria-label="Meridian Estates AI Concierge"
      >
        <Bot className="w-7 h-7 transition-transform duration-300 group-hover:scale-110 text-[#C9A24B]" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#DFBF6D] border-2 border-[#090a0f] shadow-[0_0_8px_#C9A24B]" />
      </button>
    </div>
  );
};
