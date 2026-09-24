import React, { useState, useEffect } from 'react';
import { GradeLevel, ChatMessage, StepMetadata, SessionRecord, Badge, SparkyCostume } from './types';
import { INITIAL_BADGES, SPARKY_COSTUMES, DEFAULT_SESSIONS } from './data/samples';
import { Navbar } from './components/Navbar';
import { ProblemUploader } from './components/ProblemUploader';
import { StudentTutorView } from './components/StudentTutorView';
import { ParentTeacherDashboard } from './components/ParentTeacherDashboard';
import { RewardRoom } from './components/RewardRoom';
import { WestervilleCurriculumHub } from './components/WestervilleCurriculumHub';
import { ConceptLibrary } from './components/ConceptLibrary';
import { soundFX } from './utils/soundFX';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<'student' | 'concepts' | 'curriculum' | 'dashboard' | 'rewards'>('student');
  const [isProblemActive, setIsProblemActive] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('4th');
  const [problemText, setProblemText] = useState('');
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [thinkingMode, setThinkingMode] = useState(true);
  const [modelChoice, setModelChoice] = useState('gemini-3.1-pro-preview');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMetadata, setCurrentMetadata] = useState<StepMetadata | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Gamified & session state (persisted locally)
  const [stars, setStars] = useState<number>(() => {
    const saved = localStorage.getItem('socratic_stars');
    return saved ? Number(saved) : 85;
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('socratic_streak');
    return saved ? Number(saved) : 3;
  });

  const [whyCount, setWhyCount] = useState<number>(() => {
    const saved = localStorage.getItem('socratic_why_count');
    return saved ? Number(saved) : 4;
  });

  const [sessions, setSessions] = useState<SessionRecord[]>(() => {
    const saved = localStorage.getItem('socratic_sessions');
    return saved ? JSON.parse(saved) : DEFAULT_SESSIONS;
  });

  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [costumes] = useState<SparkyCostume[]>(SPARKY_COSTUMES);
  const [activeCostumeId, setActiveCostumeId] = useState<string>('costume-detective');
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => soundFX.getSoundEnabled());

  const handleToggleSound = () => {
    const nextState = !isSoundEnabled;
    setIsSoundEnabled(nextState);
    soundFX.setSoundEnabled(nextState);
  };

  const handleTabChangeWithSound = (tab: 'student' | 'concepts' | 'curriculum' | 'dashboard' | 'rewards') => {
    if (tab !== activeTab) {
      soundFX.playWhoosh();
    }
    setActiveTab(tab);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('socratic_stars', stars.toString());
  }, [stars]);

  useEffect(() => {
    localStorage.setItem('socratic_streak', streakDays.toString());
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem('socratic_why_count', whyCount.toString());
  }, [whyCount]);

  useEffect(() => {
    localStorage.setItem('socratic_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleRewardStars = (amount: number) => {
    soundFX.playDing();
    setStars((prev) => prev + amount);
  };

  const handleStartTutor = async (params: {
    problemText: string;
    imageBase64?: string;
    mimeType?: string;
    gradeLevel: GradeLevel;
    thinkingMode: boolean;
    modelChoice: string;
    sampleData?: any;
  }) => {
    setIsLoading(true);
    setProblemText(params.problemText);
    setImageBase64(params.imageBase64);
    setSelectedGrade(params.gradeLevel);
    setThinkingMode(params.thinkingMode);
    setModelChoice(params.modelChoice);

    try {
      const res = await fetch('/api/tutor/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemText: params.problemText,
          imageBase64: params.imageBase64,
          mimeType: params.mimeType,
          gradeLevel: params.gradeLevel,
          thinkingMode: params.thinkingMode,
          modelChoice: params.modelChoice,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const firstMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'tutor',
          text: data.text,
          timestamp: Date.now(),
          actionType: 'start',
          metadata: data.metadata,
          modelUsed: data.modelUsed,
        };

        setMessages([firstMessage]);
        setCurrentMetadata(data.metadata);
        setIsProblemActive(true);

        // Award first-step bravery points & confetti
        handleRewardStars(10);
        confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });
      } else {
        throw new Error(data.error || 'Could not start tutoring session');
      }
    } catch (err: any) {
      console.error('Failed to start tutor:', err);
      // Compassionate client-side fallback
      const fallbackMetadata: StepMetadata = {
        currentStep: 1,
        totalSteps: 3,
        stepTitle: 'Step 1: Discover the Problem Clues',
        scaffoldType: params.problemText.includes('/') ? 'fractions' : params.problemText.includes('x') ? 'balance_scale' : 'none',
        scaffoldData: {
          numeratorA: 2,
          denominatorA: 4,
          numeratorB: 1,
          denominatorB: 2,
          leftUnknowns: 3,
          leftConstants: 4,
          rightConstants: 19,
        },
        guidingQuestion: 'What is the very first clue or number you notice here?',
        encouragement: "You took the brave first step! Let's solve this mystery together.",
        curiosityFact: "Did you know asking 'Why?' is what real mathematicians do every single day?",
      };

      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'tutor',
        text: `Hello there, mathematician! 🦉 Sparky here! I'm so excited to tackle this problem with you.\n\nTake a slow breath. We are NOT going to rush to the final answer. Instead, let's walk through Step 1 together!\n\n${params.problemText ? `Looking at "${params.problemText}":` : 'Looking at your photo:'}\nWhat is the very first clue or number you spot?`,
        timestamp: Date.now(),
        actionType: 'start',
        metadata: fallbackMetadata,
        modelUsed: 'gemini-3.1-pro-preview',
      };

      setMessages([fallbackMsg]);
      setCurrentMetadata(fallbackMetadata);
      setIsProblemActive(true);
      handleRewardStars(10);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (
    text: string,
    actionType: 'regular' | 'why' | 'hint' | 'check' | 'simplify' = 'regular'
  ) => {
    if (!text.trim() || isLoading) return;

    // If student asked "Why did we do that?", celebrate curiosity!
    if (actionType === 'why') {
      const nextWhy = whyCount + 1;
      setWhyCount(nextWhy);
      handleRewardStars(15);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else if (actionType === 'check') {
      handleRewardStars(10);
    } else {
      handleRewardStars(5);
    }

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
      actionType,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: newHistory.map((m) => ({
            role: m.role,
            content: m.text,
          })),
          message: text,
          gradeLevel: selectedGrade,
          problemContext: problemText,
          currentStep: currentMetadata?.currentStep || 1,
          actionType,
          thinkingMode,
          modelChoice,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const tutorMsg: ChatMessage = {
          id: `msg-tutor-${Date.now()}`,
          role: 'tutor',
          text: data.text,
          timestamp: Date.now(),
          actionType,
          metadata: data.metadata,
          modelUsed: data.modelUsed,
        };

        setMessages((prev) => [...prev, tutorMsg]);
        if (data.metadata) {
          setCurrentMetadata(data.metadata);

          // If reached final step or completed
          if (data.metadata.currentStep >= (data.metadata.totalSteps || 3)) {
            soundFX.playCelebration();
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });

            // Record in session logs
            const newRecord: SessionRecord = {
              id: `sess-${Date.now()}`,
              date: 'Just now',
              problemSummary: problemText.slice(0, 45) || 'Math Problem from Photo',
              gradeLevel: selectedGrade,
              totalSteps: data.metadata.totalSteps || 3,
              stepsCompleted: data.metadata.currentStep,
              whyQuestionsAsked: actionType === 'why' ? 1 : 0,
              hintsUsed: actionType === 'hint' ? 1 : 0,
              durationMinutes: 6,
              conceptsTrained: ['Socratic Reasoning', `${selectedGrade} Grade Mathematics`],
              growthNote: 'Demonstrated high persistence and engagement throughout all steps.',
            };
            setSessions((prev) => [newRecord, ...prev]);
          }
        }
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.warn('Chat request failed, using compassionate local fallback:', err);
      let replyText = '';
      if (actionType === 'why') {
        replyText = `🌟 That is the BEST question you could ever ask! Real mathematicians always ask "Why?".\n\nThink of it like balancing on a seesaw with a friend. If someone gives your friend a 5-pound backpack, the seesaw tips! To make it level again, what do we have to give you? Exactly, a 5-pound backpack!\n\nThat is why whenever we do something to one side of an equation, we do the exact same thing to the other side to keep it perfectly balanced. Does that feel clear?`;
      } else if (actionType === 'hint') {
        replyText = `💡 Here is a friendly clue: Take a close look at the numbers. Can you group them into tens, or see if one number is twice as big as the other? Give it a try!`;
      } else {
        replyText = `You are doing wonderfully! Let's think about this together: What happens if we test that idea on our visual model on the left?`;
      }

      const tutorMsg: ChatMessage = {
        id: `msg-tutor-${Date.now()}`,
        role: 'tutor',
        text: replyText,
        timestamp: Date.now(),
        actionType,
        metadata: currentMetadata,
        modelUsed: 'gemini-3.1-pro-preview',
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewProblem = () => {
    setIsProblemActive(false);
    setProblemText('');
    setImageBase64(undefined);
    setMessages([]);
    setCurrentMetadata(undefined);
    setActiveTab('student');
  };

  const handleLaunchPracticeFromCurriculum = (pText: string, scaffoldType: any, scaffoldData: any) => {
    setActiveTab('student');
    handleStartTutor({
      problemText: pText,
      gradeLevel: selectedGrade,
      thinkingMode: true,
      modelChoice: 'gemini-3.1-pro-preview',
      sampleData: { scaffoldType, ...scaffoldData },
    });
  };

  const activeCostume = costumes.find((c) => c.id === activeCostumeId) || costumes[0];

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChangeWithSound}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        stars={stars}
        streakDays={streakDays}
        onNewProblem={handleNewProblem}
        activeCostumeIcon={activeCostume.icon}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* STUDENT TUTOR TAB */}
        {activeTab === 'student' && (
          <>
            {!isProblemActive ? (
              <ProblemUploader
                onStartTutor={handleStartTutor}
                isLoading={isLoading}
                selectedGrade={selectedGrade}
                onSelectGrade={setSelectedGrade}
                onOpenCurriculum={() => setActiveTab('curriculum')}
                onOpenConcepts={() => setActiveTab('concepts')}
              />
            ) : (
              <StudentTutorView
                problemText={problemText}
                imageBase64={imageBase64}
                gradeLevel={selectedGrade}
                thinkingMode={thinkingMode}
                messages={messages}
                currentMetadata={currentMetadata}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onNewProblem={handleNewProblem}
                onRewardStars={handleRewardStars}
                onOpenConcepts={() => setActiveTab('concepts')}
              />
            )}
          </>
        )}

        {/* CONCEPT LIBRARY TAB */}
        {activeTab === 'concepts' && (
          <ConceptLibrary
            selectedGrade={selectedGrade}
            onSelectGrade={setSelectedGrade}
            onLaunchPractice={handleLaunchPracticeFromCurriculum}
          />
        )}

        {/* WESTERVILLE CURRICULUM HUB TAB */}
        {activeTab === 'curriculum' && (
          <WestervilleCurriculumHub
            selectedGrade={selectedGrade}
            onSelectGrade={setSelectedGrade}
            onLaunchPractice={handleLaunchPracticeFromCurriculum}
          />
        )}

        {/* PARENT & TEACHER DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <ParentTeacherDashboard
            sessions={sessions}
            totalStars={stars}
            whyCount={whyCount}
            streakDays={streakDays}
          />
        )}

        {/* REWARDS ROOM & TROPHY TAB */}
        {activeTab === 'rewards' && (
          <RewardRoom
            stars={stars}
            badges={badges}
            costumes={costumes}
            activeCostumeId={activeCostumeId}
            onEquipCostume={setActiveCostumeId}
            onBuyCostume={(costume) => {
              setStars((prev) => prev - costume.cost);
              setActiveCostumeId(costume.id);
            }}
            streakDays={streakDays}
            whyCount={whyCount}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/60 bg-white/70 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          <strong>SocraticSpark</strong> — Compassionate Socratic AI Math Tutor for 3rd, 4th & 5th Graders • Powered by Gemini 3.1 Pro Preview with High Thinking Mode
        </p>
      </footer>
    </div>
  );
}
