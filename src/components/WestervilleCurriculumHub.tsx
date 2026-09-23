import React, { useState } from 'react';
import { GradeLevel } from '../types';
import {
  WESTERVILLE_DISTRICT_INFO,
  WESTERVILLE_CURRICULUM_UNITS,
  NUMBER_CORNER_ROUTINES,
  WestervilleUnit,
} from '../data/westervilleCurriculum';
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  MapPin,
  Play,
  School,
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onLaunchPractice: (problemText: string, scaffoldType: any, scaffoldData: any) => void;
}

export const WestervilleCurriculumHub: React.FC<Props> = ({
  selectedGrade,
  onSelectGrade,
  onLaunchPractice,
}) => {
  const currentGradeUnits = WESTERVILLE_CURRICULUM_UNITS.filter(
    (u) => u.grade === (selectedGrade === 'Advanced' ? '5th' : selectedGrade)
  );

  const [selectedUnit, setSelectedUnit] = useState<WestervilleUnit>(
    currentGradeUnits[0] || WESTERVILLE_CURRICULUM_UNITS[0]
  );
  const [selectedSchool, setSelectedSchool] = useState<string>(
    WESTERVILLE_DISTRICT_INFO.elementarySchools[0]
  );
  const [activeSubTab, setActiveSubTab] = useState<'units' | 'numberCorner' | 'customReview'>('units');

  // Custom AI lesson review generator state
  const [customTopic, setCustomTopic] = useState('');
  const [reviewAudience, setReviewAudience] = useState<'student' | 'parent'>('student');
  const [aiReviewResult, setAiReviewResult] = useState<string | null>(null);
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);
  const [isSpeakingReview, setIsSpeakingReview] = useState(false);

  const handleUnitSelect = (unit: WestervilleUnit) => {
    setSelectedUnit(unit);
  };

  const handleGradeChange = (grade: GradeLevel) => {
    onSelectGrade(grade);
    const unitsForNewGrade = WESTERVILLE_CURRICULUM_UNITS.filter(
      (u) => u.grade === (grade === 'Advanced' ? '5th' : grade)
    );
    if (unitsForNewGrade.length > 0) {
      setSelectedUnit(unitsForNewGrade[0]);
    }
  };

  const handleGenerateCustomReview = async (topicToUse?: string) => {
    const topic = topicToUse || customTopic;
    if (!topic.trim()) return;

    setIsGeneratingReview(true);
    setAiReviewResult(null);

    try {
      const res = await fetch('/api/curriculum/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeLevel: selectedGrade === 'Advanced' ? '5th' : selectedGrade,
          unitTitle: selectedUnit.title,
          lessonOrTopic: topic,
          audience: reviewAudience,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiReviewResult(data.reviewText);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.warn('Custom review error, generating local fallback:', err);
      setAiReviewResult(
        `### Westerville Bridges Lesson Review: ${topic}\n\n**Key Visual Model:** In Westerville classrooms, this lesson relies on visual representations like ratio tables and open area models so students build mental flexibility.\n\n**The "Why":** Instead of memorizing rules without understanding, this approach helps students decompose numbers into friendly parts.\n\n**Watch Out For:** Double check that students identify what the question is asking before choosing operations.`
      );
    } finally {
      setIsGeneratingReview(false);
    }
  };

  const handleSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeakingReview) {
      window.speechSynthesis.cancel();
      setIsSpeakingReview(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onend = () => setIsSpeakingReview(false);
    utterance.onerror = () => setIsSpeakingReview(false);
    setIsSpeakingReview(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Westerville District Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
          <School className="w-96 h-96" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" /> Westerville City School District (Ohio)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/15 backdrop-blur text-xs font-bold text-amber-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Bridges in Mathematics & Ohio Standards Aligned
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight drop-shadow-xs">
            Westerville Elementary Math Curriculum Hub
          </h1>

          <p className="text-sm sm:text-base text-amber-100 max-w-3xl leading-relaxed">
            Review lessons before your student practices! Access all <strong>Units 1–8</strong> of{' '}
            <strong>Bridges in Mathematics</strong>, <strong>Number Corner</strong> routines, and{' '}
            <strong>Ohio Learning Standards</strong> taught across all 12 Westerville elementary schools.
          </p>

          {/* School Selector Dropdown & Grade Filter */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/95 text-slate-800 px-3 py-1.5 rounded-2xl shadow-xs text-xs font-bold">
              <School className="w-4 h-4 text-amber-600" />
              <span>School:</span>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
              >
                {WESTERVILLE_DISTRICT_INFO.elementarySchools.map((sch) => (
                  <option key={sch} value={sch}>
                    {sch}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Switcher */}
            <div className="flex items-center gap-1 bg-black/20 p-1 rounded-2xl backdrop-blur">
              {(['3rd', '4th', '5th'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => handleGradeChange(g)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedGrade === g
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs: Units 1-8 | Number Corner | Custom Lesson Review */}
      <div className="flex items-center gap-2 border-b border-amber-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('units')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'units'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bridges Units 1–8 (Grade {selectedGrade})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('numberCorner')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'numberCorner'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Number Corner Workouts</span>
        </button>

        <button
          onClick={() => setActiveSubTab('customReview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'customReview'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Ask Sparky to Review ANY Lesson</span>
        </button>
      </div>

      {/* SUBTAB 1: BRIDGES UNITS 1-8 EXPLORER */}
      {activeSubTab === 'units' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Unit Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Select a Bridges Unit ({selectedGrade} Grade)
            </h3>

            <div className="space-y-2">
              {currentGradeUnits.map((u) => {
                const isSelected = selectedUnit.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleUnitSelect(u)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-white border-amber-500 shadow-sm ring-2 ring-amber-200'
                        : 'bg-white/80 hover:bg-white border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-heading font-extrabold text-sm shrink-0 ${
                        isSelected ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      U{u.unitNumber}
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-heading font-bold text-xs sm:text-sm text-slate-800 truncate">
                          {u.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        🗓️ {u.timeOfYear}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Unit In-Depth Review (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/80 space-y-5">
              {/* Unit Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase">
                      Unit {selectedUnit.unitNumber} • {selectedGrade} Grade
                    </span>
                    <span className="text-xs text-slate-400">🗓️ {selectedUnit.timeOfYear}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-800 mt-1">
                    {selectedUnit.title}
                  </h2>
                </div>

                {/* Ohio Standards Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedUnit.ohioStandards.map((std) => (
                    <span
                      key={std}
                      className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold"
                      title="Ohio Learning Standard for Mathematics"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lesson Overview */}
              <div className="space-y-1.5">
                <h4 className="font-heading font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-600" />
                  What Westerville Students Learn in This Unit:
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedUnit.overview}
                </p>
              </div>

              {/* Key Visual Models (Core Bridges Methodology) */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Bridges Visual Models Used in Westerville Classrooms:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUnit.visualModels.map((vm, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-white border border-indigo-200 text-indigo-900 text-xs font-bold shadow-2xs"
                    >
                      📐 {vm}
                    </span>
                  ))}
                </div>
              </div>

              {/* "Why We Do This" & Conceptual Superpower */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-5 rounded-2xl border border-purple-200 space-y-2">
                <div className="flex items-center gap-2 text-purple-900 font-heading font-bold text-sm">
                  <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
                  The Socratic "Why Did We Do That?" Behind This Unit:
                </div>
                <p className="text-xs sm:text-sm text-purple-950 leading-relaxed font-medium">
                  {selectedUnit.whyWeDoThis}
                </p>
              </div>

              {/* Parent & Family Support Tips */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-heading font-bold text-xs uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4 text-amber-600" />
                  Parent & Home Connection Coaching Tip ({selectedSchool}):
                </div>
                <p className="text-xs text-amber-950 leading-relaxed">
                  {selectedUnit.parentTips}
                </p>
              </div>

              {/* Common Pitfalls / Stumbling Blocks */}
              <div className="space-y-1.5">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500">
                  Common Stumbling Blocks to Watch For:
                </h4>
                <ul className="space-y-1 text-xs text-slate-600">
                  {selectedUnit.commonPitfalls.map((pitfall, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{pitfall}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ready to Practice Call-to-Action */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-800">
                    Practice a Westerville Bridges Problem
                  </h4>
                  <p className="text-xs text-slate-500">
                    "{selectedUnit.sampleProblem.title}" — Solved with Sparky's step-by-step Socratic guidance.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onLaunchPractice(
                      selectedUnit.sampleProblem.text,
                      selectedUnit.sampleProblem.scaffoldType,
                      selectedUnit.sampleProblem.scaffoldData
                    );
                    confetti({ particleCount: 40, spread: 60 });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Step-by-Step Practice →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: NUMBER CORNER ROUTINES */}
      {activeSubTab === 'numberCorner' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" /> 20-Minute Daily Skill Building
            </div>
            <h2 className="text-2xl font-heading font-extrabold text-slate-800">
              Number Corner in Westerville Classrooms
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              In addition to main units, every Westerville elementary classroom spends 20 minutes each day on
              <strong>Number Corner</strong>. It introduces concepts weeks before they appear in formal units, giving students low-stakes practice with patterns, calendar math, and mental strings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NUMBER_CORNER_ROUTINES.map((routine, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/30 border border-slate-200 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-slate-800">
                    {routine.title}
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900">
                    {routine.frequency}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Classroom Focus:</strong> {routine.focus}
                </p>
                <div className="text-xs text-amber-900 bg-white/80 p-3 rounded-xl border border-amber-200/60">
                  🏡 <strong>Home Conversation Tip:</strong> {routine.homeTip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: CUSTOM LESSON REVIEW GENERATOR */}
      {activeSubTab === 'customReview' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Interactive Pre-Lesson AI Tutor
            </div>
            <h2 className="text-2xl font-heading font-extrabold text-slate-800">
              Review ANY Westerville Lesson or Homework Session
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Have a specific Bridges session coming up (e.g. "Unit 4 Module 2: Open Number Lines" or "Home Connections Page 42")?
              Let Sparky walk through the visual models and concepts before your child begins practicing!
            </p>
          </div>

          {/* Quick Pre-fill Topic Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Popular Tricky Bridges Lessons in Westerville:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Unit 3: Equivalent Fractions on a Number Line',
                'Unit 2: Area Model for 2-Digit Multiplication (e.g. 24 × 18)',
                'Unit 5: Division with Ratio Tables & Partial Quotients',
                'Unit 4: Constant Difference Subtraction (e.g. 500 - 298 = 502 - 300)',
                'Unit 2: Adding Fractions with Clock Faces (1/3 + 1/4 = 7/12)',
              ].map((pill, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCustomTopic(pill);
                    handleGenerateCustomReview(pill);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
                >
                  ⚡ {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Input & Form */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-700">
                Enter your lesson name, module, or math question:
              </label>

              {/* Audience toggle */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                <button
                  onClick={() => setReviewAudience('student')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    reviewAudience === 'student' ? 'bg-amber-500 text-white' : 'hover:text-slate-900'
                  }`}
                >
                  For Student (Kid-friendly)
                </button>
                <button
                  onClick={() => setReviewAudience('parent')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    reviewAudience === 'parent' ? 'bg-indigo-600 text-white' : 'hover:text-slate-900'
                  }`}
                >
                  For Parent / Caregiver
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Unit 3 Module 2 Session 4: Comparing fractions with unlike denominators..."
                className="flex-1 px-4 py-3 rounded-2xl bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium"
              />
              <button
                onClick={() => handleGenerateCustomReview()}
                disabled={!customTopic.trim() || isGeneratingReview}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
              >
                {isGeneratingReview ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Review Lesson</span>
              </button>
            </div>
          </div>

          {/* AI Review Result */}
          {aiReviewResult && (
            <div className="bg-gradient-to-br from-purple-50/70 to-amber-50/70 rounded-3xl p-6 border border-purple-200 shadow-xs space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-purple-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-200 text-purple-900 flex items-center justify-center text-lg">
                    🦉
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-800 text-sm sm:text-base">
                      Coach Sparky's Westerville Bridges Lesson Walkthrough
                    </h3>
                    <span className="text-[11px] text-purple-700 font-semibold">
                      Mode: {reviewAudience === 'parent' ? 'Parent Coaching Guide' : 'Student Visual Review'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSpeech(aiReviewResult)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 transition-colors cursor-pointer"
                >
                  {isSpeakingReview ? <VolumeX className="w-3.5 h-3.5 text-rose-600" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeakingReview ? 'Stop voice' : 'Listen aloud'}</span>
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed space-y-2">
                {aiReviewResult}
              </div>

              {/* One-click Practice Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    onLaunchPractice(
                      customTopic || 'Westerville Bridges Practice Problem',
                      'fractions',
                      {}
                    );
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Practice This Lesson in Tutor Now →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
