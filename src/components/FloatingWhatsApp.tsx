import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('Hi Meridian Estates, I want to inquire about properties in Azure Bay.');

  const handleSend = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/920000000000?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* WhatsApp Chat Popover in luxury dark theme */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 rounded-2xl bg-[#090a0f] border border-[#C9A24B] shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(201,162,75,0.25)] p-4 text-white animate-fadeIn backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#C9A24B]/20 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#090a0f] border border-[#C9A24B] flex items-center justify-center text-[#C9A24B] shadow-[0_0_12px_rgba(201,162,75,0.3)]">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Meridian Concierge</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-[#DFBF6D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] animate-pulse" />
                  <span>Online · Azure Bay Private Desk</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-stone-300 leading-relaxed mb-3">
            Welcome to Meridian Estates. How can our Azure Bay property directors assist your private acquisition today?
          </div>

          <div className="space-y-2 mb-3">
            <button
              onClick={() => setMessage('Inquiring about The Cliffside Villa in Coral Ridge (PKR 28.5 Crore)')}
              className="w-full text-left text-[11px] p-2 rounded-lg bg-white/5 hover:bg-[#C9A24B]/15 hover:border-[#C9A24B]/40 border border-transparent transition-colors text-stone-300 hover:text-white cursor-pointer"
            >
              • Inquire about The Cliffside Villa (PKR 28.5 Cr)
            </button>
            <button
              onClick={() => setMessage('Schedule private coastal viewing in Coral Ridge / Marina Crest')}
              className="w-full text-left text-[11px] p-2 rounded-lg bg-white/5 hover:bg-[#C9A24B]/15 hover:border-[#C9A24B]/40 border border-transparent transition-colors text-stone-300 hover:text-white cursor-pointer"
            >
              • Schedule private viewing in Azure Bay
            </button>
          </div>

          {/* Input & Send */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type inquiry..."
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-black/60 border border-[#C9A24B]/30 focus:border-[#C9A24B] focus:outline-none text-white placeholder-stone-500"
            />
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#DFBF6D] hover:from-[#b8913d] hover:to-[#ceaf5e] text-black flex items-center justify-center transition-colors shrink-0 shadow-md cursor-pointer"
              aria-label="Send via WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button: dark #090a0f, gold #C9A24B border, gold icon, NOT green */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#090a0f] hover:bg-[#12141c] text-[#C9A24B] border-2 border-[#C9A24B] shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_24px_rgba(201,162,75,0.4)] hover:shadow-[0_8px_36px_rgba(201,162,75,0.65)] flex items-center justify-center transition-all duration-300 transform hover:scale-105 group cursor-pointer"
        aria-label="Direct WhatsApp Concierge"
      >
        <MessageCircle className="w-7 h-7 fill-current transition-transform duration-300 group-hover:scale-110 text-[#C9A24B]" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#DFBF6D] border-2 border-[#090a0f] shadow-[0_0_8px_#C9A24B]" />
      </button>
    </div>
  );
};
