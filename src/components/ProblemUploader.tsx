import React, { useState, useRef } from 'react';
import { GradeLevel, SampleProblem } from '../types';
import { SAMPLE_PROBLEMS } from '../data/samples';
import { Upload, Camera, Sparkles, BookOpen, Brain, Zap, Image as ImageIcon, CheckCircle, ArrowRight } from 'lucide-react';

interface Props {
  onStartTutor: (params: {
    problemText: string;
    imageBase64?: string;
    mimeType?: string;
    gradeLevel: GradeLevel;
    thinkingMode: boolean;
    modelChoice: string;
    sampleData?: any;
  }) => void;
  isLoading: boolean;
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onOpenCurriculum?: () => void;
  onOpenConcepts?: () => void;
}

export const ProblemUploader: React.FC<Props> = ({
  onStartTutor,
  isLoading,
  selectedGrade,
  onSelectGrade,
  onOpenCurriculum,
  onOpenConcepts,
}) => {
  const [problemText, setProblemText] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [thinkingMode, setThinkingMode] = useState<boolean>(true);
  const [modelChoice, setModelChoice] = useState<string>('gemini-3.1-pro-preview');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP).');
      return;
    }
    setImageMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageBase64(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleProblem) => {
    setProblemText(sample.text);
    onSelectGrade(sample.grade);
    setImageBase64(sample.imageThumbnailSvg);
    setImageMimeType('image/svg+xml');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemText.trim() && !imageBase64) return;

    onStartTutor({
      problemText,
      imageBase64: imageBase64 || undefined,
      mimeType: imageMimeType,
      gradeLevel: selectedGrade,
      thinkingMode,
      modelChoice,
    });
  };

  const addMathSymbol = (sym: string) => {
    setProblemText((prev) => prev + sym);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 sm:p-8 text-amber-950 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-900">
              <Sparkles className="w-3.5 h-3.5" /> Socratic Learning Guide
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight text-white drop-shadow-xs">
              No calculators here. Just a patient teacher! 🦉
            </h1>
            <p className="text-sm sm:text-base text-amber-100 max-w-xl font-medium">
              Upload a photo of your math problem or type it in. Sparky will walk you through <strong>Step 1</strong>, cheer for your efforts, and always answer <span className="underline decoration-white/60">"Why did we do that?"</span> with friendly metaphors!
            </p>
          </div>

          <div className="flex flex-col items-center shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/90 shadow-xl border-4 border-amber-200 flex items-center justify-center text-5xl sm:text-6xl animate-float">
              🦉
            </div>
            <span className="mt-2 text-xs font-bold bg-amber-900/40 text-white px-3 py-0.5 rounded-full">
              Coach Sparky
            </span>
          </div>
        </div>
      </div>

      {/* Grade Selector Strip */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Grade Level</span>
            <span className="text-xs text-slate-600">Tailors explanations to your age & school level</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 w-full sm:w-auto">
          {(['3rd', '4th', '5th', 'Advanced'] as GradeLevel[]).map((grade) => (
            <button
              key={grade}
              type="button"
              onClick={() => onSelectGrade(grade)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedGrade === grade
                  ? 'bg-amber-500 text-white shadow-xs scale-102'
                  : 'bg-slate-100 hover:bg-amber-100 text-slate-700'
              }`}
            >
              {grade === 'Advanced' ? '🌟 Challenge' : `${grade} Grade`}
            </button>
          ))}
        </div>
      </div>

      {/* Learning Hub & Review Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Visual Concept Library Banner */}
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-2xl p-4 border border-purple-200 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
              💡
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-purple-950">Visual Concept Library</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-purple-200 text-purple-900 uppercase">
                  Grades 3–5
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Need a quick refresher? Browse illustrated models, real-life metaphors & friendly tips anytime!
              </p>
            </div>
          </div>

          {onOpenConcepts && (
            <button
              type="button"
              onClick={onOpenConcepts}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Explore Library</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Westerville City Schools Dedicated Curriculum Banner */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-4 border border-amber-300 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
              🏫
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-950">Westerville Bridges & Number Corner</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Review specific Bridges Units 1–8 or daily Number Corner routines before your homework.
              </p>
            </div>
          </div>

          {onOpenCurriculum && (
            <button
              type="button"
              onClick={onOpenCurriculum}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Review Lessons</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Upload / Input Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/80 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo Dropzone */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>📸 Option 1: Upload Problem Photo</span>
              {imageBase64 && (
                <button
                  type="button"
                  onClick={() => setImageBase64(null)}
                  className="text-red-500 hover:text-red-600 text-xs font-medium cursor-pointer"
                >
                  Remove Photo
                </button>
              )}
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {!imageBase64 ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[190px] ${
                  dragActive
                    ? 'border-amber-500 bg-amber-50/80 scale-101'
                    : 'border-slate-300 hover:border-amber-400 bg-slate-50/70 hover:bg-amber-50/30'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 shadow-xs">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Drop photo here, or <span className="text-amber-600 underline">browse</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Works with notebook handwriting, textbook pages, algebra, or calculus!
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-full">
                  <Brain className="w-3 h-3 text-amber-700" /> Powered by Gemini Vision
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-300 bg-slate-900/5 p-2 flex items-center justify-center min-h-[190px]">
                <img
                  src={imageBase64}
                  alt="Problem to solve"
                  className="max-h-48 max-w-full rounded-xl object-contain shadow-xs"
                />
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                  <CheckCircle className="w-3 h-3" /> Photo Attached
                </div>
              </div>
            )}
          </div>

          {/* Problem Text Area */}
          <div className="space-y-2 flex flex-col">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>✏️ Option 2: Type or Edit Problem</span>
              <span className="text-[11px] text-slate-400">Words, equations, or algebra</span>
            </label>

            <textarea
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              placeholder="e.g., Maya ate 2/4 of a pizza and Leo ate 1/2... OR solve 3x + 4 = 19..."
              className="w-full flex-1 min-h-[120px] p-3.5 rounded-2xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm leading-relaxed resize-none transition-all"
            />

            {/* Quick Math Symbols */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Math keys:</span>
              {['+', '−', '×', '÷', '=', 'x', '1/2', '3/4', '²', '√', '(', ')'].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => addMathSymbol(sym)}
                  className="px-2 py-1 text-xs font-mono font-bold bg-slate-100 hover:bg-amber-100 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Thinking & Model Settings */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Thinking Mode Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={thinkingMode}
                onChange={(e) => setThinkingMode(e.target.checked)}
                className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-purple-600" />
                High Thinking Mode <span className="text-purple-600 font-bold">(gemini-3.1-pro-preview)</span>
              </span>
            </label>

            {/* Model Choice Pill */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400">Model:</span>
              <select
                value={modelChoice}
                onChange={(e) => setModelChoice(e.target.value)}
                className="bg-slate-100 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 text-xs font-medium cursor-pointer outline-none"
              >
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep Socratic & Vision)</option>
                <option value="gemini-3.5-flash">gemini-3.5-flash (Standard Socratic)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast Hints)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || (!problemText.trim() && !imageBase64)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-heading font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Sparky is reading the problem...
              </>
            ) : (
              <>
                <span>Meet Step 1 with Sparky!</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Pre-made Sample Problems for One-Click Testing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Or try an instant sample problem:
          </h3>
          <span className="text-[11px] text-slate-400">Click any card to load photo & text</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_PROBLEMS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="group bg-white rounded-2xl p-3 border border-amber-200/60 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="relative h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 flex items-center justify-center">
                  <img
                    src={sample.imageThumbnailSvg}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-1.5 right-1.5 bg-amber-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {sample.grade}
                  </span>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-slate-800 group-hover:text-amber-600 transition-colors">
                    {sample.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{sample.description}</p>
                </div>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-amber-700">
                <span>{sample.category}</span>
                <span className="group-hover:translate-x-1 transition-transform">Solve →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
