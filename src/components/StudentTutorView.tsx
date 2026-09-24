import React, { useState } from 'react';
import { ChatMessage, GradeLevel, StepMetadata } from '../types';
import { VisualScaffolding } from './VisualScaffolding';
import { ChatThread } from './ChatThread';
import { ScratchpadModal } from './ScratchpadModal';
import { ArrowLeft, Brain, Eye, Image as ImageIcon, Sparkles, CheckCircle2, RotateCcw, Lightbulb, Focus, Maximize2, Minimize2, PenTool } from 'lucide-react';
import { soundFX } from '../utils/soundFX';
import confetti from 'canvas-confetti';

interface Props {
  problemText: string;
  imageBase64?: string;
  gradeLevel: GradeLevel;
  thinkingMode: boolean;
  messages: ChatMessage[];
  currentMetadata?: StepMetadata;
  isLoading: boolean;
  onSendMessage: (text: string, actionType?: 'regular' | 'why' | 'hint' | 'check' | 'simplify') => void;
  onNewProblem: () => void;
  onRewardStars: (count: number) => void;
  onOpenConcepts?: () => void;
}

export const StudentTutorView: React.FC<Props> = ({
  problemText,
  imageBase64,
  gradeLevel,
  thinkingMode,
  messages,
  currentMetadata,
  isLoading,
  onSendMessage,
  onNewProblem,
  onRewardStars,
  onOpenConcepts,
}) => {
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(true); // Default to on for a clean, kid-friendly experience
  const [isPhotoPreviewOpen, setIsPhotoPreviewOpen] = useState(false);

  const handleVisualInteraction = (action: string) => {
    // Notify student & reward small curiosity star
    onRewardStars(5);
  };

  const currentStep = currentMetadata?.currentStep || 1;
  const totalSteps = currentMetadata?.totalSteps || 3;

  return (
    <div className={`space-y-4 transition-all duration-300 ${isFocusMode ? 'focus-mode-active max-w-5xl mx-auto' : ''}`}>
      {/* Top Banner & Stepper */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 shadow-xs border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onNewProblem}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Back to problem selection"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                {gradeLevel === 'Advanced' ? '🌟 Challenge' : `${gradeLevel} Grade`}
              </span>
              {!isFocusMode && (
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  Step-by-Step with Sparky
                </span>
              )}
            </div>
            <h2 className="font-heading font-bold text-slate-800 text-sm sm:text-base line-clamp-1 mt-0.5">
              {problemText || 'Math Problem from Photo'}
            </h2>
          </div>
        </div>

        {/* Stepper Timeline & Focus Mode Toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const stepNum = idx + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;

              return (
                <React.Fragment key={stepNum}>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-white shadow-xs scale-105'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <span>{isCompleted ? '✓' : stepNum}</span>
                    <span className="hidden sm:inline">
                      {stepNum === 1 ? 'Step 1' : stepNum === 2 ? 'Step 2' : `Step ${stepNum}`}
                    </span>
                  </div>
                  {idx < totalSteps - 1 && (
                    <div className={`h-0.5 w-3 sm:w-4 rounded ${isCompleted ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Kid Focus Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                setIsFocusMode(!isFocusMode);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                isFocusMode
                  ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-300'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
              }`}
              title={isFocusMode ? 'Exit Kid Focus Mode' : 'Turn on Kid Focus Mode (calm, distraction-free view)'}
            >
              <Focus className="w-3.5 h-3.5" />
              <span>{isFocusMode ? 'Focus On' : 'Focus Mode'}</span>
            </button>

            {/* Quick scratchpad button */}
            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                setIsScratchpadOpen(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              title="Open Whiteboard Scratchpad"
            >
              <PenTool className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Scratchpad</span>
            </button>

            {/* Photo Thumbnail Peek Button if photo exists */}
            {imageBase64 && (
              <button
                type="button"
                onClick={() => {
                  soundFX.playPop();
                  setIsPhotoPreviewOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all cursor-pointer border border-blue-200"
                title="View your homework photo"
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Photo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace: Left Column Visual Scaffolding, Right Column Chat */}
      <div className={`grid grid-cols-1 ${isFocusMode ? 'lg:grid-cols-12 gap-4' : 'lg:grid-cols-12 gap-5'} items-start`}>
        {/* Left Column: Visual Scaffolding & Tools */}
        <div className={`${isFocusMode ? 'lg:col-span-5' : 'lg:col-span-5'} space-y-3`}>
          {/* Uploaded Photo Card (Only shown in standard mode, tucked into modal button in Focus Mode to avoid clutter) */}
          {!isFocusMode && imageBase64 && (
            <div className="bg-white rounded-3xl p-3.5 shadow-xs border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                  Your Uploaded Photo
                </span>
                <button
                  onClick={() => setIsPhotoZoomed(!isPhotoZoomed)}
                  className="text-amber-700 hover:text-amber-800 flex items-center gap-1 text-[11px] cursor-pointer font-medium"
                >
                  <Eye className="w-3 h-3" /> {isPhotoZoomed ? 'Shrink' : 'Zoom in'}
                </button>
              </div>

              <div
                className={`rounded-2xl overflow-hidden bg-slate-900/5 border border-slate-200 flex items-center justify-center transition-all ${
                  isPhotoZoomed ? 'max-h-96' : 'max-h-36'
                }`}
              >
                <img
                  src={imageBase64}
                  alt="Original math problem"
                  className="w-full h-full object-contain p-1 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Interactive Visual Scaffolding Tool */}
          <VisualScaffolding
            type={currentMetadata?.scaffoldType || 'none'}
            data={currentMetadata?.scaffoldData}
            onInteract={handleVisualInteraction}
            onOpenScratchpad={() => setIsScratchpadOpen(true)}
          />

          {/* Student Mindset Card (Hidden in Focus Mode to reduce cognitive clutter) */}
          {!isFocusMode && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-3.5 border border-amber-200/70 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <span>🧘</span> Math Anxiety Tip from Sparky:
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                "Remember: It is 100% okay not to know right away! Real mathematicians test ideas, make mistakes, and ask <strong>'Why?'</strong>. Take your time!"
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Socratic Multi-turn Chat Thread */}
        <div className={`${isFocusMode ? 'lg:col-span-7' : 'lg:col-span-7'} ${isFocusMode ? 'h-[680px]' : 'h-[640px]'}`}>
          <ChatThread
            messages={messages}
            currentMetadata={currentMetadata}
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            thinkingMode={thinkingMode}
          />
        </div>
      </div>

      {/* Quick Photo Preview Modal for Focus Mode */}
      {isPhotoPreviewOpen && imageBase64 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-4 max-w-lg w-full shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-600" /> Your Homework Photo
              </span>
              <button
                onClick={() => setIsPhotoPreviewOpen(false)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold cursor-pointer"
              >
                Close (Esc)
              </button>
            </div>
            <div className="max-h-[60vh] overflow-auto rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center p-2">
              <img
                src={imageBase64}
                alt="Problem Worksheet"
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Scratchpad Modal */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        onShareWork={(dataUrl) => {
          onRewardStars(15);
          confetti({ particleCount: 40, spread: 50 });
        }}
      />
    </div>
  );
};
