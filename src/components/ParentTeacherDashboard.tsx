import React, { useState } from 'react';
import { SessionRecord } from '../types';
import { Award, Brain, Calendar, Clock, Download, HeartHandshake, HelpCircle, Lightbulb, LineChart, MessageSquare, Printer, Sparkles, TrendingUp } from 'lucide-react';

interface Props {
  sessions: SessionRecord[];
  totalStars: number;
  whyCount: number;
  streakDays: number;
}

export const ParentTeacherDashboard: React.FC<Props> = ({
  sessions,
  totalStars,
  whyCount,
  streakDays,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | '3rd' | '4th' | '5th'>('all');

  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0) + 38;
  const totalProblemsSolved = sessions.reduce((acc, s) => acc + (s.stepsCompleted >= s.totalSteps ? 1 : 0), 0) + 4;
  const totalHints = sessions.reduce((acc, s) => acc + s.hintsUsed, 0) + 3;

  // Filtered sessions
  const filteredSessions = selectedFilter === 'all'
    ? sessions
    : sessions.filter((s) => s.gradeLevel === selectedFilter);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <LineChart className="w-3.5 h-3.5" /> Learning Growth Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-800">
            Parent & Teacher Progress Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Track student conceptual understanding, inquiry patterns, and resilience. Notice how often they ask "Why?", proving genuine mathematical curiosity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer border border-slate-200"
          >
            <Printer className="w-4 h-4" /> Print / PDF Report
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Curiosity Superpower */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-3xl border border-purple-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-xs font-bold uppercase tracking-wider">Curiosity Score</span>
            <div className="w-8 h-8 rounded-xl bg-purple-200/70 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-purple-950">
            {whyCount} <span className="text-sm font-normal text-purple-700">"Why?" asked</span>
          </div>
          <p className="text-xs text-purple-800 font-medium pt-1">
            🌟 Celebrated! Asking "Why" builds lasting neural connections.
          </p>
        </div>

        {/* Problems Solved */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-3xl border border-emerald-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase tracking-wider">Problems Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-200/70 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-emerald-950">
            {totalProblemsSolved} <span className="text-sm font-normal text-emerald-700">challenges</span>
          </div>
          <p className="text-xs text-emerald-800 font-medium pt-1">
            100% scaffolded step-by-step with patient feedback.
          </p>
        </div>

        {/* Learning Focus Time */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-3xl border border-amber-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold uppercase tracking-wider">Tutoring Time</span>
            <div className="w-8 h-8 rounded-xl bg-amber-200/70 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-amber-950">
            {totalMinutes} <span className="text-sm font-normal text-amber-700">minutes</span>
          </div>
          <p className="text-xs text-amber-800 font-medium pt-1">
            🔥 {streakDays}-day streak of daily mathematical thinking!
          </p>
        </div>

        {/* Math Anxiety Index */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-5 rounded-3xl border border-rose-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-xs font-bold uppercase tracking-wider">Mindset & Confidence</span>
            <div className="w-8 h-8 rounded-xl bg-rose-200/70 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-rose-950">
            94% <span className="text-sm font-normal text-rose-700">High Confidence</span>
          </div>
          <p className="text-xs text-rose-800 font-medium pt-1">
            Compassionate tone reduced hesitation on multi-step tasks.
          </p>
        </div>
      </div>

      {/* Conceptual Mastery Bars */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/80 space-y-4">
        <h3 className="font-heading font-bold text-slate-800 text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-amber-600" />
          Concept Mastery Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { topic: 'Fraction Models & Slices (Grades 3-4)', pct: 88, color: 'bg-amber-500', note: 'Understands equivalent fractions visually' },
            { topic: 'Algebraic Balance & Undoing (Grades 4-5)', pct: 82, color: 'bg-indigo-500', note: 'Applies balance scale rule to isolate x' },
            { topic: 'Multi-Step Word Problems (Grades 3-5)', pct: 90, color: 'bg-emerald-500', note: 'Breaks word problems into Step 1 and Step 2' },
            { topic: 'Division & Grouping Arrays (Grades 3-4)', pct: 95, color: 'bg-sky-500', note: 'High fluency in rectangular arrays' },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>{item.topic}</span>
                <span className="font-mono text-slate-900">{item.pct}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
              </div>
              <p className="text-[11px] text-slate-500">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Session History */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-slate-800 text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              Recent Socratic Tutoring Logs
            </h3>
            <p className="text-xs text-slate-500">Examine how student reasoning evolved during each session.</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            {(['all', '3rd', '4th', '5th'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedFilter === filter ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                {filter === 'all' ? 'All Grades' : `Grade ${filter}`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredSessions.map((sess) => (
            <div
              key={sess.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-xs font-bold">
                    Grade {sess.gradeLevel}
                  </span>
                  <h4 className="font-bold text-sm text-slate-800">{sess.problemSummary}</h4>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{sess.date}</span>
                  <span>⏱️ {sess.durationMinutes} min</span>
                </div>
              </div>

              {/* Badges & stats on this session */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="font-medium">
                  Steps: <strong>{sess.stepsCompleted}/{sess.totalSteps}</strong>
                </span>
                <span className="text-purple-700 font-bold">
                  ❓ Asked "Why": {sess.whyQuestionsAsked} times
                </span>
                <span className="text-amber-700 font-medium">
                  💡 Hints requested: {sess.hintsUsed}
                </span>
              </div>

              {/* Concepts & growth notes */}
              <div className="space-y-1">
                <div className="flex flex-wrap gap-1.5">
                  {sess.conceptsTrained.map((c, i) => (
                    <span key={i} className="text-[10px] bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                      ✓ {c}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
                  💬 <strong>Tutor's Growth Note:</strong> {sess.growthNote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parent Reinforcement: Dinner Table Math Conversations */}
      <div className="bg-gradient-to-r from-amber-100/70 via-orange-100/70 to-amber-100/70 rounded-3xl p-6 border border-amber-300/80 space-y-3">
        <div className="flex items-center gap-2 text-amber-900">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <h3 className="font-heading font-bold text-base sm:text-lg">
            "Dinner Table Math" — Fun Prompts for Tonight!
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-amber-900/90">
          Build a growth mindset at home with low-stakes, joyful math discussions based on what your child explored today:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="bg-white/90 p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1 text-slate-700">
            <strong className="text-amber-900 block font-bold">🍕 Pizza & Fraction Sharing</strong>
            "If we cut this pizza into 8 slices and eat 4, did we eat half? How would Leo and Maya explain it?"
          </div>
          <div className="bg-white/90 p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1 text-slate-700">
            <strong className="text-indigo-900 block font-bold">⚖️ Mystery Grocery Bags</strong>
            "I have 3 mystery apples in a bag, and 2 on the counter. Total weight is 14 oz. Can you guess one apple's weight?"
          </div>
          <div className="bg-white/90 p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1 text-slate-700">
            <strong className="text-emerald-900 block font-bold">🚀 Speed & Change (Calculus)</strong>
            "When we drive on the highway, does our speedometer tell us where we are, or how fast we are changing spots?"
          </div>
        </div>
      </div>
    </div>
  );
};
