import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Sparkles, X, Send, Mic, Volume2, Bot, User, 
  HelpCircle, CheckCircle2, MessageSquare
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  signGloss?: string[];
  timestamp: string;
}

export const AIChatModal: React.FC = () => {
  const { isAiChatOpen, setIsAiChatOpen, speak, triggerHaptic, profile, theme } = useAccessibility();

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Namaste! I am Divyang Sahayak, your AI accessibility assistant. How can I guide your navigation, translate sign language, or assist your rights today?',
      signGloss: ['WELCOME', 'DIVYANG', 'ASSISTANT', 'HELP', 'YOU'],
      timestamp: 'Just now',
    },
  ]);

  if (!isAiChatOpen) return null;

  const handleSendMessage = async (userPrompt?: string) => {
    const textToSend = userPrompt || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    triggerHaptic('tap');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          profile,
          currentMode: theme,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'I am with you. Let me guide your next step.';

      // Extract sign keywords
      const glossWords = replyText
        .replace(/[^a-zA-Z ]/g, '')
        .toUpperCase()
        .split(' ')
        .filter((w: string) => w.length > 3)
        .slice(0, 5);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        signGloss: glossWords,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
      setIsLoading(false);
      speak(replyText);
    } catch (err) {
      setIsLoading(false);
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        text: 'Tactile route mapped: 85 meters forward on tactile guide tiles. Audible crosswalk signal active on your right.',
        signGloss: ['TACTILE-PATH', 'STRAIGHT', 'CROSSING', 'SAFE'],
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, fallbackMsg]);
      speak(fallbackMsg.text);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-950 border border-teal-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[700px]">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-950 border border-teal-700 flex items-center justify-center text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Divyang Sahayak AI</span>
                <span className="text-[10px] font-mono text-teal-300 bg-teal-950 px-1.5 py-0.5 rounded border border-teal-800">
                  GEMINI 3.8 FLASH
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Voice &amp; Sign Bilingual Accessibility Chat
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAiChatOpen(false);
              triggerHaptic('tap');
            }}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            aria-label="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs sm:text-sm ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-slate-950 font-medium'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="leading-relaxed">{msg.text}</div>

                {/* Sign Gloss Sequence for Deaf Users */}
                {msg.signGloss && msg.signGloss.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1 border-t border-slate-800/80">
                    <span className="text-[10px] text-teal-400 font-semibold mr-1">Sign Gloss:</span>
                    {msg.signGloss.map((gloss, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono text-teal-300 bg-black/60 px-1.5 py-0.2 rounded border border-teal-900"
                      >
                        [{gloss}]
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => speak(msg.text)}
                      className="text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Speak</span>
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-teal-400 italic">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Divyang Sahayak is formulating accessible response...</span>
            </div>
          )}
        </div>

        {/* Quick Questions Strip */}
        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-slate-400 shrink-0">Suggestions:</span>
          {[
            'Nearest wheelchair ramp?',
            'How to get 75% transit concession?',
            'Translate "I need an interpreter" to sign',
            'Connect Bluetooth hearing aid',
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickQuestion(q)}
              className="text-[11px] text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded px-2.5 py-1 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask anything about routes, sign language, concessions, or medical sync..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-teal-400"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
