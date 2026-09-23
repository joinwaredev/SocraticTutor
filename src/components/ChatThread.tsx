import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, StepMetadata } from '../types';
import { Send, Volume2, VolumeX, HelpCircle, Lightbulb, CheckCircle2, Sparkles, ArrowRight, Brain, Smile } from 'lucide-react';

interface Props {
  messages: ChatMessage[];
  currentMetadata?: StepMetadata;
  onSendMessage: (text: string, actionType?: 'regular' | 'why' | 'hint' | 'check' | 'simplify') => void;
  isLoading: boolean;
  thinkingMode: boolean;
}

export const ChatThread: React.FC<Props> = ({
  messages,
  currentMetadata,
  onSendMessage,
  isLoading,
  thinkingMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim(), 'regular');
    setInputText('');
  };

  const handleSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // slightly slower, clear pace for kids
    utterance.pitch = 1.1; // friendly tone
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur rounded-3xl shadow-sm border border-amber-200/80 overflow-hidden">
      {/* Step Tracker Header */}
      <div className="px-5 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-heading font-extrabold text-lg shadow-xs">
            {currentMetadata?.currentStep || 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-slate-800 text-sm sm:text-base">
                {currentMetadata?.stepTitle || 'Step 1: Understand the Goal'}
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900">
                Step {currentMetadata?.currentStep || 1} of {currentMetadata?.totalSteps || 3}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              {currentMetadata?.guidingQuestion || "Let's figure out what clues the problem gave us!"}
            </p>
          </div>
        </div>

        {thinkingMode && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
            <Brain className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span>High Thinking</span>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => {
          const isTutor = msg.role === 'tutor';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${
                isTutor ? 'self-start' : 'self-end ml-auto flex-row-reverse'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center text-lg shadow-xs ${
                  isTutor ? 'bg-amber-100 border border-amber-200 text-amber-900' : 'bg-sky-500 text-white'
                }`}
              >
                {isTutor ? '🦉' : '🎒'}
              </div>

              {/* Bubble */}
              <div className="space-y-1.5">
                <div
                  className={`rounded-2xl p-4 text-sm leading-relaxed ${
                    isTutor
                      ? 'bg-amber-50/70 text-slate-800 border border-amber-200/70 shadow-xs'
                      : 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm'
                  }`}
                >
                  {/* Action tag if student clicked a quick Socratic button */}
                  {!isTutor && msg.actionType && msg.actionType !== 'regular' && (
                    <div className="inline-block text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full mb-1.5">
                      {msg.actionType === 'why' && '❓ Question: Why did we do that?'}
                      {msg.actionType === 'hint' && '💡 Asked for a hint'}
                      {msg.actionType === 'check' && '✏️ Checking step'}
                      {msg.actionType === 'simplify' && '🔄 Asked for simpler story'}
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-medium">{msg.text}</div>

                  {/* Encouragement / Curiosity note */}
                  {isTutor && msg.metadata?.encouragement && (
                    <div className="mt-2.5 pt-2 border-t border-amber-200/50 flex items-center gap-1.5 text-xs text-amber-900 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{msg.metadata.encouragement}</span>
                    </div>
                  )}

                  {isTutor && msg.metadata?.curiosityFact && (
                    <div className="mt-2 text-xs bg-white/80 p-2 rounded-xl text-amber-800 border border-amber-200/40">
                      💡 <strong>Curious Fact:</strong> {msg.metadata.curiosityFact}
                    </div>
                  )}
                </div>

                {/* Footer with TTS and Model tag */}
                {isTutor && (
                  <div className="flex items-center gap-3 px-1 text-[11px] text-slate-400">
                    <button
                      onClick={() => handleSpeech(msg.text)}
                      className="flex items-center gap-1 text-slate-500 hover:text-amber-600 transition-colors cursor-pointer font-medium"
                      title="Read aloud"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-600" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeaking ? 'Stop voice' : 'Listen'}</span>
                    </button>
                    {msg.modelUsed && (
                      <span className="text-[10px] text-slate-400">Model: {msg.modelUsed}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing / Thinking Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 self-start max-w-[80%]">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-lg animate-bounce">
              🦉
            </div>
            <div className="bg-amber-50/80 rounded-2xl px-4 py-3 border border-amber-200 flex items-center gap-2 text-xs font-semibold text-amber-900">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Sparky is thinking patiently with you...</span>
            </div>
          </div>
        )}
      </div>

      {/* Socratic Quick Action Bar */}
      <div className="px-4 py-2.5 bg-amber-50/50 border-t border-amber-100 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Socratic Helpers:
        </span>

        {/* "Why did we do that?" Button - Core user requirement! */}
        <button
          type="button"
          onClick={() => onSendMessage('Why did we do that? Can you explain the rule or idea behind this step?', 'why')}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold transition-all shadow-xs hover:scale-102 cursor-pointer border border-purple-200"
        >
          <span>❓</span> "Why did we do that?"
        </button>

        {/* "Can I have a hint?" Button */}
        <button
          type="button"
          onClick={() => onSendMessage('Can you give me a small hint to nudge my thinking?', 'hint')}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all shadow-xs hover:scale-102 cursor-pointer border border-amber-200"
        >
          <Lightbulb className="w-3 h-3 text-amber-600" /> Hint
        </button>

        {/* "Explain like I'm 8" Button */}
        <button
          type="button"
          onClick={() => onSendMessage('Can you explain that using a fun story or pizza metaphor?', 'simplify')}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 text-xs font-bold transition-all shadow-xs cursor-pointer border border-orange-200"
        >
          <Smile className="w-3 h-3 text-orange-600" /> Kid Metaphor
        </button>

        {/* "I'm ready for next step!" */}
        <button
          type="button"
          onClick={() => onSendMessage("I understand this step! What's the next step to solve this?", 'check')}
          disabled={isLoading}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition-all shadow-xs cursor-pointer border border-emerald-200"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ready for next step →
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your answer, question, or thought here..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium transition-all"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="w-12 h-12 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white flex items-center justify-center shadow-md transition-all cursor-pointer shrink-0"
          title="Send to Sparky"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
