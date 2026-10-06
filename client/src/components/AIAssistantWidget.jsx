import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageCircle, RefreshCw, ChevronDown, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function AIAssistantWidget() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Initialize greeting on language change
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: lang === 'ta'
            ? 'வணக்கம்! நான் **ராஜா ஸ்டோர் AI உதவியாளர்** 🤖.\nஉங்களுக்கு என்ன சந்தேகம் அல்லது உதவி வேண்டும்? கீழே உள்ள கேள்விகளை அழுத்தலாம் அல்லது தட்டச்சு செய்யலாம்.'
            : 'Hello! I am the **RAJA STORE AI Assistant** 🤖.\nHave any doubts, questions, or issues? Ask me anything or tap one of the quick topics below!'
        }
      ]);
    }
  }, [lang]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickQuestions = lang === 'ta' ? [
    'டெலிவரி உண்டா?',
    'டிராக்கரை ஆஃப் செய்வது எப்படி?',
    'எப்படி ஆர்டர் செய்வது?',
    'அரிசி மற்றும் ஆட்டா விலை என்ன?',
    'கடை உள்நுழைவு (Login) உதவி'
  ] : [
    'Is home delivery available?',
    'How to turn off tracker?',
    'How do I place an order?',
    'Check Atta & Rice prices',
    'Store staff login help'
  ];

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMsg).trim();
    if (!query || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          lang,
          role: 'customer'
        })
      });

      const data = await res.json();
      const aiReply = data.reply || (lang === 'ta' ? 'மன்னிக்கவும், தகவல் பெற முடியவில்லை.' : 'Sorry, could not process request.');

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiReply
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: lang === 'ta'
            ? 'மன்னிக்கவும், சர்வர் இணைப்பு பிழை. சிறிது நேரம் கழித்து முயற்சிக்கவும்.'
            : 'Sorry, connection error. Please try again shortly.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-3 rounded-full shadow-2xl shadow-orange-950/30 flex items-center gap-2.5 font-black text-xs sm:text-sm tracking-wide transition-all duration-200 active:scale-95 cursor-pointer ring-4 ring-orange-200/50 group"
          title="Ask RAJA AI Assistant / சந்தேகங்களை தீர்க்க"
        >
          <div className="relative">
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-orange-600 animate-pulse"></span>
          </div>
          <span>{lang === 'ta' ? 'ராஜா AI உதவி' : 'RAJA AI Help'}</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
        </button>
      )}

      {/* AI Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] max-h-[85vh] h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm tracking-tight">
                    {lang === 'ta' ? 'ராஜா AI உதவியாளர்' : 'RAJA AI Assistant'}
                  </h4>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {lang === 'ta' ? 'சந்தேகங்கள் & பிழைகளை தீர்க்கும் AI' : 'Resolves any doubt or error issue 24/7'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-slate-50 border-b border-slate-200/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="shrink-0 text-[11px] font-bold bg-white hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full transition-all cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-orange-600 text-white font-medium rounded-tr-xs shadow-md shadow-orange-600/20'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-500">
                <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-2xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-slate-400 font-semibold ml-1">
                    {lang === 'ta' ? 'பதிலளிக்கிறது...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder={lang === 'ta' ? 'உங்கள் கேள்வியை தட்டச்சு செய்க...' : 'Type your question or doubt here...'}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMsg.trim() || isLoading}
              className="p-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shrink-0 shadow-sm shadow-orange-600/30"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
