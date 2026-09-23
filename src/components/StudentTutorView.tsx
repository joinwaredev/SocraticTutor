import React, { useState } from 'react';
import { ChatMessage, GradeLevel, StepMetadata } from '../types';
import { VisualScaffolding } from './VisualScaffolding';
import { ChatThread } from './ChatThread';
import { ScratchpadModal } from './ScratchpadModal';
import { ArrowLeft, Brain, Eye, Image as ImageIcon, Sparkles, CheckCircle2, RotateCcw, Lightbulb } from 'lucide-react';
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

  const handleVisualInteraction = (action: string) => {
    // Notify student & reward small curiosity star
    onRewardStars(5);
  };

  const currentStep = currentMetadata?.currentStep || 1;
  const totalSteps = currentMetadata?.totalSteps || 3;

  return (
    <div className="space-y-4">
      {/* Top Banner & Stepper */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Socratic Guided Step-by-Step
              </span>
            </div>
            <h2 className="font-heading font-bold text-slate-800 text-base sm:text-lg line-clamp-1 mt-0.5">
              {problemText || 'Math Problem from Photo'}
            </h2>
          </div>
        </div>

        {/* Stepper Timeline */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-center">
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
                    <div className={`h-0.5 w-4 rounded ${isCompleted ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {onOpenConcepts && (
            <button
              type="button"
              onClick={onOpenConcepts}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
              title="Look up a concept in the Concept Library"
            >
              <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Concept Library</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace: Left Column Visual Scaffolding & Photo, Right Column Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Visual Scaffolding & Original Problem */}
        <div className="lg:col-span-5 space-y-4">
          {/* Uploaded Photo Card if available */}
          {imageBase64 && (
            <div className="bg-white rounded-3xl p-4 shadow-xs border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                  Your Uploaded Photo
                </span>
                <button
                  onClick={() => setIsPhotoZoomed(!isPhotoZoomed)}
                  className="text-amber-700 hover:text-amber-800 flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <Eye className="w-3 h-3" /> {isPhotoZoomed ? 'Shrink' : 'Zoom in'}
                </button>
              </div>

              <div
                className={`rounded-2xl overflow-hidden bg-slate-900/5 border border-slate-200 flex items-center justify-center transition-all ${
                  isPhotoZoomed ? 'max-h-96' : 'max-h-44'
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

          {/* Student Mindset Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/70 text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <span>🧘</span> Math Anxiety Tip from Sparky:
            </div>
            <p className="text-slate-600 leading-relaxed">
              "Remember: It is 100% okay not to know right away! Real scientists and mathematicians test ideas, make mistakes, and ask <strong>'Why?'</strong>. Take your time, there is zero rush!"
            </p>
          </div>
        </div>

        {/* Right Column: Socratic Multi-turn Chat Thread */}
        <div className="lg:col-span-7 h-[640px]">
          <ChatThread
            messages={messages}
            currentMetadata={currentMetadata}
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            thinkingMode={thinkingMode}
          />
        </div>
      </div>

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
