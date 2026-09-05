'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { ALL_CURRICULA, LessonTopic } from '@/lib/data/curriculum';

type LanguageType = 'python' | 'c' | 'java';

export default function LearnPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>('python');
  const [activeTopicId, setActiveTopicId] = useState<string>('py-variables');
  const [completedLessons, setCompletedLessons] = useState<string[]>(['py-variables', 'py-datatypes']);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [notification, setNotification] = useState('');

  const currentCurriculum = ALL_CURRICULA[selectedLanguage] || ALL_CURRICULA.python;
  const activeTopic = currentCurriculum.find((t) => t.id === activeTopicId) || currentCurriculum[0];

  useEffect(() => {
    if (ALL_CURRICULA[selectedLanguage]?.[0]) {
      setActiveTopicId(ALL_CURRICULA[selectedLanguage][0].id);
      setQuizSelectedOption(null);
      setQuizSubmitted(false);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
  }, [activeTopicId]);

  const handleMarkCompleted = async () => {
    if (!activeTopic || completedLessons.includes(activeTopic.id)) return;
    setIsSavingProgress(true);

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xpEarned: activeTopic.xp,
          completedLessonId: activeTopic.id,
          activityTitle: `Completed ${selectedLanguage.toUpperCase()} lesson: ${activeTopic.title}`,
          activityType: 'lesson',
        }),
      });

      if (res.ok) {
        setCompletedLessons((prev) => [...prev, activeTopic.id]);
        setNotification(`🎉 Lesson completed! +${activeTopic.xp} XP earned!`);
        setTimeout(() => setNotification(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update progress', err);
    } finally {
      setIsSavingProgress(false);
    }
  };

  const handleQuizAnswer = async (index: number) => {
    if (quizSubmitted || !activeTopic) return;
    setQuizSelectedOption(index);
    setQuizSubmitted(true);

    const isCorrect = index === activeTopic.quickQuiz.correctIndex;
    if (isCorrect) {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            xpEarned: 15,
            quizResult: { isCorrect: true, xp: 15 },
            activityTitle: `Answered quiz on ${activeTopic.title}`,
            activityType: 'quiz',
          }),
        });
        setNotification('✓ Correct answer! +15 XP earned!');
        setTimeout(() => setNotification(''), 3000);
      } catch (err) {
        console.error('Quiz progress error', err);
      }
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 font-mono">
        {/* Header & Language Selector */}
        <div className="terminal-card p-6 rounded-2xl border border-sky-800/40 bg-slate-950/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">📚</span>
              <h1 className="text-xl font-bold text-sky-200 terminal-prompt">
                CURRICULUM & CONCEPTS
              </h1>
            </div>
            <p className="text-xs text-sky-400/80">
              Master fundamentals, data structures, and algorithms step-by-step with interactive lessons.
            </p>
          </div>

          {/* Language Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-sky-900/40">
            <button
              onClick={() => setSelectedLanguage('python')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                selectedLanguage === 'python'
                  ? 'bg-sky-500/25 text-sky-200 border border-sky-400/50 shadow-md shadow-sky-950'
                  : 'text-sky-400 hover:text-sky-200'
              }`}
            >
              <span>🐍</span> Python
            </button>
            <button
              onClick={() => setSelectedLanguage('c')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                selectedLanguage === 'c'
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-md shadow-cyan-950'
                  : 'text-sky-400 hover:text-cyan-300'
              }`}
            >
              <span>⚙</span> C
            </button>
            <button
              onClick={() => setSelectedLanguage('java')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                selectedLanguage === 'java'
                  ? 'bg-orange-500/25 text-orange-200 border border-orange-400/50 shadow-md shadow-orange-950'
                  : 'text-sky-400 hover:text-orange-300'
              }`}
            >
              <span>☕</span> Java
            </button>
          </div>
        </div>

        {notification && (
          <div className="p-3.5 rounded-xl bg-sky-950/90 border border-cyan-500/60 text-cyan-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-bounce">
            <span>✨</span>
            <span>{notification}</span>
          </div>
        )}

        {/* TWO COLUMN CURRICULUM LAYOUT: Sidebar (Topics) + Content (Topic Detail) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar: Topic Navigation List (4 cols) */}
          <div className="lg:col-span-4 terminal-card p-4.5 rounded-2xl border border-sky-800/40 bg-slate-950/95 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-sky-900/30 pb-2.5 text-xs">
              <span className="font-bold text-sky-300 uppercase tracking-wider">
                {selectedLanguage.toUpperCase()} TOPICS
              </span>
              <span className="text-[11px] text-sky-600 font-bold">
                {currentCurriculum.filter((t) => completedLessons.includes(t.id)).length} / {currentCurriculum.length} Done
              </span>
            </div>

            <div className="space-y-1.5 max-h-[600px] overflow-y-auto terminal-scrollbar pr-1">
              {currentCurriculum.map((topic) => {
                const isCompleted = completedLessons.includes(topic.id);
                const isActive = activeTopicId === topic.id;

                return (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTopicId(topic.id)}
                    className={`w-full text-left p-3.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2.5 ${
                      isActive
                        ? 'bg-sky-500/20 text-sky-200 border border-sky-400/50 font-bold shadow-md shadow-sky-950'
                        : 'text-sky-400/80 hover:bg-slate-900 hover:text-sky-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={isCompleted ? 'text-cyan-400 font-bold' : isActive ? 'text-sky-300' : 'text-slate-600'}>
                        {isCompleted ? '✓' : isActive ? '→' : '○'}
                      </span>
                      <span className="truncate">{topic.title}</span>
                    </div>

                    <span className="text-[10px] text-amber-300 font-mono font-bold shrink-0">
                      +{topic.xp} XP
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Area: Topic Deep Dive & Practice (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {activeTopic ? (
              <>
                {/* 1. TOPIC OVERVIEW & EXPLANATION */}
                <div className="terminal-card p-6 rounded-2xl border border-sky-800/40 bg-slate-950/95 space-y-4 shadow-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-sky-900/30 pb-3.5">
                    <div>
                      <span className="text-[10px] text-cyan-300 font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800">
                        {activeTopic.category}
                      </span>
                      <h2 className="text-xl font-bold text-sky-200 mt-1.5">{activeTopic.title}</h2>
                    </div>

                    <button
                      onClick={handleMarkCompleted}
                      disabled={completedLessons.includes(activeTopic.id) || isSavingProgress}
                      className={`terminal-button text-xs py-2 px-4 font-bold ${
                        completedLessons.includes(activeTopic.id)
                          ? 'bg-sky-900/20 text-sky-500 border-sky-800/30 cursor-default'
                          : 'bg-sky-500/30 text-sky-100 border-sky-400/60 shadow-md'
                      }`}
                    >
                      {completedLessons.includes(activeTopic.id) ? '✓ Completed' : `Mark as Completed (+${activeTopic.xp} XP)`}
                    </button>
                  </div>

                  <p className="text-xs text-sky-300 leading-relaxed">
                    {activeTopic.description}
                  </p>

                  {/* Concept Breakdown Sections */}
                  <div className="space-y-3 pt-2">
                    {activeTopic.conceptBreakdown.map((sec, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-sky-900/40 space-y-1.5 shadow-sm">
                        <h4 className="text-xs font-bold text-sky-200 flex items-center gap-2">
                          <span className="text-cyan-400 font-bold">❯</span> {sec.title}
                        </h4>
                        <p className="text-xs text-sky-300/90 leading-relaxed">{sec.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. SAMPLE CODE & EXPECTED OUTPUT */}
                <div className="terminal-card p-6 rounded-2xl border border-sky-800/40 bg-slate-950/95 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-sky-900/30 pb-3">
                    <h3 className="text-sm font-bold text-sky-200 flex items-center gap-2">
                      <span>💻</span>
                      <span>INTERACTIVE EXAMPLE CODE</span>
                    </h3>
                    <Link
                      href="/workspace"
                      className="text-xs text-cyan-400 hover:text-cyan-200 flex items-center gap-1 font-mono font-bold"
                    >
                      Open in Workspace ❯
                    </Link>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-sky-800/40 bg-slate-950">
                    <pre className="p-4 text-xs font-mono text-sky-200 overflow-x-auto leading-relaxed">
                      {activeTopic.sampleCode}
                    </pre>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-sky-500 tracking-wider">
                      EXPECTED OUTPUT
                    </span>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-sky-900/50 text-xs font-mono text-cyan-300 whitespace-pre-wrap shadow-inner">
                      {activeTopic.expectedOutput}
                    </div>
                  </div>
                </div>

                {/* 3. COMMON MISTAKES & PITFALLS */}
                {activeTopic.commonMistakes && activeTopic.commonMistakes.length > 0 && (
                  <div className="terminal-card p-6 rounded-2xl border border-rose-900/40 bg-slate-950/95 space-y-3.5 shadow-2xl">
                    <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                      <span>⚠️</span>
                      <span>COMMON MISTAKES & HOW TO AVOID THEM</span>
                    </h3>

                    <div className="space-y-3 pt-1">
                      {activeTopic.commonMistakes.map((m, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/50 space-y-2 text-xs">
                          <div className="font-bold text-rose-300 flex items-center gap-1.5">
                            <span>✕ Mistake:</span>
                            <span>{m.mistake}</span>
                          </div>
                          <p className="text-rose-300/80"><span className="font-semibold text-rose-200">Why it fails:</span> {m.whyWrong}</p>
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-sky-800/40 text-sky-200 text-[11px]">
                            <span className="text-cyan-400 font-bold">✓ Fix: </span> {m.correction}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. QUICK CHECK QUIZ */}
                <div className="terminal-card p-6 rounded-2xl border border-indigo-800/40 bg-slate-950/95 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-indigo-900/30 pb-3">
                    <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                      <span>🧪</span>
                      <span>QUICK CONCEPT CHECK</span>
                    </h3>
                    <span className="text-[11px] text-amber-300 font-bold">+15 XP</span>
                  </div>

                  <p className="text-xs font-bold text-sky-200">
                    {activeTopic.quickQuiz.question}
                  </p>

                  <div className="space-y-2.5">
                    {activeTopic.quickQuiz.options.map((option, idx) => {
                      const isSelected = quizSelectedOption === idx;
                      const isCorrect = idx === activeTopic.quickQuiz.correctIndex;
                      let btnStyle = 'bg-slate-900/80 border-sky-900/40 text-sky-200 hover:border-sky-500';

                      if (quizSubmitted) {
                        if (isCorrect) btnStyle = 'bg-sky-950 border-sky-400 text-sky-100 font-bold shadow-md shadow-sky-950';
                        else if (isSelected) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                        else btnStyle = 'bg-slate-950 border-slate-800 text-slate-600 opacity-50';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(idx)}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{String.fromCharCode(65 + idx)}. {option}</span>
                          {quizSubmitted && isCorrect && <span className="text-cyan-400 font-bold">✓ Correct</span>}
                          {quizSubmitted && isSelected && !isCorrect && <span className="text-rose-400 font-bold">✕ Incorrect</span>}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-4 rounded-xl bg-slate-900 border border-sky-800/40 text-xs text-sky-200 leading-relaxed shadow-inner">
                      <span className="font-bold text-cyan-400">Explanation: </span>
                      {activeTopic.quickQuiz.explanation}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="terminal-card p-12 text-center text-sky-700 text-xs">
                Select a topic from the curriculum to begin learning.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
