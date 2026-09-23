import React, { useState, useEffect } from 'react';
import { GradeLevel, ScaffoldType } from '../types';
import { MATH_CONCEPTS, MathConcept } from '../data/conceptLibrary';
import { ConceptIllustration } from './ConceptIllustrations';
import {
  Search,
  BookOpen,
  Sparkles,
  Volume2,
  VolumeX,
  Star,
  Play,
  Lightbulb,
  HeartHandshake,
  CheckCircle,
  HelpCircle,
  Filter,
  Compass,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onLaunchPractice: (problemText: string, scaffoldType: ScaffoldType, scaffoldData: any) => void;
}

export const ConceptLibrary: React.FC<Props> = ({
  selectedGrade,
  onSelectGrade,
  onLaunchPractice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<'All' | '3rd' | '4th' | '5th'>(
    selectedGrade === 'Advanced' ? '5th' : (selectedGrade as any)
  );
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sparky_concept_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Audio Speech state
  const [speakingConceptId, setSpeakingConceptId] = useState<string | null>(null);

  // Custom AI Concept Explainer state
  const [customConceptQuery, setCustomConceptQuery] = useState('');
  const [customAiExplanation, setCustomAiExplanation] = useState<string | null>(null);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  // Save bookmarks
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('sparky_concept_bookmarks', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  // Text-to-speech for concepts
  const handleReadAloud = (concept: MathConcept, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (speakingConceptId === concept.id) {
      window.speechSynthesis.cancel();
      setSpeakingConceptId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const narrationText = `Here is ${concept.title}. ${concept.oneLiner} Think of it like this: ${concept.metaphor.title}. ${concept.metaphor.story} Why does this work? ${concept.whyItWorks} Sparky's pro tip: ${concept.proTip}. You've got this!`;
    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onend = () => setSpeakingConceptId(null);
    utterance.onerror = () => setSpeakingConceptId(null);
    setSpeakingConceptId(concept.id);
    window.speechSynthesis.speak(utterance);
  };

  // Filtered concepts list
  const filteredConcepts = MATH_CONCEPTS.filter((c) => {
    if (filterGrade !== 'All' && c.grade !== filterGrade) return false;
    if (filterCategory !== 'All' && c.category !== filterCategory) return false;
    if (showBookmarksOnly && !bookmarkedIds.includes(c.id)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = c.title.toLowerCase().includes(q);
      const inOneLiner = c.oneLiner.toLowerCase().includes(q);
      const inMetaphor = c.metaphor.title.toLowerCase().includes(q) || c.metaphor.story.toLowerCase().includes(q);
      const inWhy = c.whyItWorks.toLowerCase().includes(q);
      const inTags = c.tags.some((t) => t.toLowerCase().includes(q));
      return inTitle || inOneLiner || inMetaphor || inWhy || inTags;
    }

    return true;
  });

  const categories = [
    'All',
    'Fractions & Decimals',
    'Multiplication & Division',
    'Geometry & Measurement',
    'Number Sense & Mental Math',
    'Algebraic & Spatial Thinking',
  ];

  // Custom AI Concept Explainer Handler
  const handleAskCustomConcept = async () => {
    if (!customConceptQuery.trim()) return;
    setIsGeneratingCustom(true);
    setCustomAiExplanation(null);

    try {
      const res = await fetch('/api/curriculum/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeLevel: filterGrade === 'All' ? selectedGrade : filterGrade,
          unitTitle: 'Concept Library Reference',
          lessonOrTopic: customConceptQuery,
          audience: 'student',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCustomAiExplanation(data.reviewText);
        confetti({ particleCount: 25, spread: 50 });
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setCustomAiExplanation(
        `### Concept: ${customConceptQuery}\n\n**Visual Mental Model:** Imagine this concept using physical objects like building blocks or friendly numbers.\n\n**Why it works:** Decomposing numbers into friendly chunks removes the pressure of memorizing arbitrary rules.\n\n**Sparky's Encouragement:** Every great mathematician started by being curious! Keep asking questions.`
      );
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
          <BookOpen className="w-80 h-80" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Elementary Math Concept Library
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/20 backdrop-blur text-xs font-semibold text-purple-100">
              Grades 3rd, 4th & 5th
            </span>
            {bookmarkedIds.length > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/30 backdrop-blur text-xs font-bold text-amber-200">
                ⭐ {bookmarkedIds.length} Bookmarked
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight">
            The Visual Math Concept Library
          </h1>

          <p className="text-xs sm:text-sm text-purple-100 max-w-2xl leading-relaxed">
            Reference common math concepts anytime outside of tutoring sessions! Explore short,
            illustrated visual models, memorable real-life metaphors, and the conceptual "why it works"
            behind every strategy.
          </p>

          {/* Quick Search & Grade Select */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search concepts, metaphors, or terms (e.g. 'pizza', 'area model', 'powers of 10')..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium outline-none shadow-xs focus:ring-2 focus:ring-amber-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Grade Switcher */}
            <div className="flex items-center gap-1 bg-black/25 p-1 rounded-2xl backdrop-blur shrink-0">
              {(['All', '3rd', '4th', '5th'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setFilterGrade(g)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterGrade === g
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {g === 'All' ? 'All Grades' : `Grade ${g}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Bookmarks Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Topic:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bookmarks filter toggle */}
        <button
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            showBookmarksOnly
              ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span>My Bookmarks ({bookmarkedIds.length})</span>
        </button>
      </div>

      {/* Count Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>
          Showing {filteredConcepts.length} illustrated {filteredConcepts.length === 1 ? 'concept' : 'concepts'}
          {filterGrade !== 'All' ? ` for ${filterGrade} Grade` : ''}
          {filterCategory !== 'All' ? ` in ${filterCategory}` : ''}
        </span>
        {searchQuery && <span>Filter: "{searchQuery}"</span>}
      </div>

      {/* Concept Cards Grid */}
      {filteredConcepts.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center space-y-3 border border-slate-200">
          <div className="text-4xl">🔍</div>
          <h3 className="font-heading font-bold text-slate-800 text-lg">No concepts found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or switching to "All Grades" or "All Categories".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterGrade('All');
              setFilterCategory('All');
              setShowBookmarksOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold cursor-pointer hover:bg-amber-600"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredConcepts.map((concept) => {
            const isBookmarked = bookmarkedIds.includes(concept.id);
            const isSpeaking = speakingConceptId === concept.id;

            return (
              <div
                key={concept.id}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                {/* Card Top: Badges & Action Buttons */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-extrabold uppercase tracking-wide">
                        Grade {concept.grade}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
                        {concept.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Read Aloud Button */}
                      <button
                        type="button"
                        onClick={(e) => handleReadAloud(concept, e)}
                        className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                          isSpeaking
                            ? 'bg-rose-100 border-rose-300 text-rose-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                        title={isSpeaking ? 'Stop voice' : 'Listen to Sparky read this concept'}
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      {/* Bookmark Star Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(concept.id, e)}
                        className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                          isBookmarked
                            ? 'bg-amber-100 border-amber-300 text-amber-600'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500'
                        }`}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark concept'}
                      >
                        <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Title & One-Liner */}
                  <div>
                    <h2 className="text-lg sm:text-xl font-heading font-extrabold text-slate-800 leading-snug">
                      {concept.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                      {concept.oneLiner}
                    </p>
                  </div>

                  {/* Metaphor / Real-World Story Box */}
                  <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/60 p-3.5 rounded-2xl border border-amber-200 space-y-1">
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{concept.metaphor.title}</span>
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed">
                      {concept.metaphor.story}
                    </p>
                  </div>

                  {/* Interactive Visual Demonstration */}
                  <div className="pt-1">
                    <ConceptIllustration concept={concept} />
                  </div>

                  {/* The Conceptual "Why It Works" */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                    <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Why This Works:</span>
                    </div>
                    <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                      {concept.whyItWorks}
                    </p>
                  </div>

                  {/* Sparky's Pro-Tip */}
                  <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Sparky's Pro Tip:</strong> {concept.proTip}
                    </div>
                  </div>

                  {/* Encouraging Affirmation */}
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold px-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>"{concept.encouragement}"</span>
                  </div>
                </div>

                {/* Card Bottom: Practice With Sparky Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {concept.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] text-slate-400 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onLaunchPractice(
                        concept.practicePrompt.problemText,
                        concept.practicePrompt.scaffoldType,
                        concept.practicePrompt.scaffoldData
                      );
                      confetti({ particleCount: 35, spread: 55 });
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Try with Sparky →</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BOTTOM SECTION: "Ask Sparky to Explain ANY Concept" AI Generator */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
            🦉
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-slate-800 text-base sm:text-lg">
              Want Sparky to Explain Another Math Concept?
            </h2>
            <p className="text-xs text-slate-600">
              Type any math topic, theorem, or term (e.g., "Prime Numbers", "Distributive Property", "Mixed Numbers") to generate a kid-friendly visual explanation!
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="text"
            value={customConceptQuery}
            onChange={(e) => setCustomConceptQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskCustomConcept()}
            placeholder="e.g., Why do we invert and multiply when dividing fractions?"
            className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-purple-200 text-slate-800 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button
            type="button"
            onClick={handleAskCustomConcept}
            disabled={!customConceptQuery.trim() || isGeneratingCustom}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
          >
            {isGeneratingCustom ? <span className="animate-spin">⏳</span> : <Zap className="w-4 h-4" />}
            <span>Explain Concept</span>
          </button>
        </div>

        {/* AI Custom Concept Result */}
        {customAiExplanation && (
          <div className="p-5 rounded-2xl bg-white border border-purple-200 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Sparky's Explanation for "{customConceptQuery}"
              </span>
              <button
                onClick={() => setCustomAiExplanation(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {customAiExplanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
