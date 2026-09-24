import React from 'react';
import { GradeLevel } from '../types';
import { Sparkles, Trophy, LineChart, BookOpen, PlusCircle, Lightbulb, Volume2, VolumeX } from 'lucide-react';

interface Props {
  activeTab: 'student' | 'concepts' | 'curriculum' | 'dashboard' | 'rewards';
  onTabChange: (tab: 'student' | 'concepts' | 'curriculum' | 'dashboard' | 'rewards') => void;
  selectedGrade: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
  stars: number;
  streakDays: number;
  onNewProblem: () => void;
  activeCostumeIcon: string;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  selectedGrade,
  onGradeChange,
  stars,
  streakDays,
  onNewProblem,
  activeCostumeIcon,
  isSoundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand & Mascot */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => onTabChange('student')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-sm border-2 border-amber-300 animate-float">
            {activeCostumeIcon || '🦉'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight">
                Socratic<span className="text-amber-500">Spark</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                Math Tutor
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Grades 3, 4 & 5 • Compassionate Step-by-Step
            </p>
          </div>
        </div>

        {/* Center Tabs */}
        <nav className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => onTabChange('student')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🎒</span>
            <span className="hidden sm:inline">Tutor</span>
          </button>

          <button
            onClick={() => onTabChange('concepts')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'concepts'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Concept Library</span>
            <span className="sm:hidden">Concepts</span>
          </button>

          <button
            onClick={() => onTabChange('curriculum')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'curriculum'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Westerville Lessons</span>
            <span className="sm:hidden">Lessons</span>
          </button>

          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LineChart className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Parent & Teacher</span>
            <span className="sm:hidden">Progress</span>
          </button>

          <button
            onClick={() => onTabChange('rewards')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'rewards'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Rewards</span>
          </button>
        </nav>

        {/* Right Side: Sound FX Toggle, Currency & New Problem */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              isSoundEnabled
                ? 'bg-amber-100/70 border-amber-300 text-amber-900 hover:bg-amber-200/80 shadow-2xs'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-200/70'
            }`}
            title={isSoundEnabled ? 'Sound Effects Enabled (Click to Mute)' : 'Sound Effects Muted (Click to Enable)'}
            aria-label={isSoundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {isSoundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-700" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Stars & Streak */}
          <div className="hidden sm:flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900">
            <span title="Spark Stars">⭐ {stars}</span>
            <span className="text-slate-300">•</span>
            <span title="Streak Days">🔥 {streakDays}d</span>
          </div>

          <button
            onClick={onNewProblem}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            title="Start a new problem"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Problem</span>
          </button>
        </div>
      </div>
    </header>
  );
};
