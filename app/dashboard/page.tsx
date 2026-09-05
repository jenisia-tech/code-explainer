'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { calculateLanguageProgress, getXpToNextLevel } from '@/lib/progress';

interface UserData {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  problemsSolved: string[];
  completedLessons: string[];
  quizStats: { accuracy: number; totalAnswered: number; totalCorrect: number };
  achievements: string[];
  recentActivity: { id: string; type: string; title: string; timestamp: string; xpEarned: number }[];
  preferences?: { defaultLanguage: string; explanationLevel: string };
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to load user', err);
    } finally {
      setIsLoading(false);
    }
  };

  const progress = calculateLanguageProgress(
    user?.completedLessons || ['py-variables', 'py-datatypes'],
    user?.problemsSolved || ['reverse-string']
  );

  const xpInfo = getXpToNextLevel(user?.xp || 350);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-sky-400 flex items-center justify-center font-mono">
        <div className="text-center space-y-3">
          <div className="inline-block w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sky-600 terminal-cursor">Initializing student workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout user={user} onRefreshUser={fetchUserData}>
      <div className="space-y-6 font-mono">
        {/* WELCOME TERMINAL HERO CARD */}
        <div className="terminal-card bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/40 border border-sky-700/40 p-6 sm:p-7 rounded-2xl relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-xs px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-300 font-bold tracking-wider">
                  STUDENT PORTAL
                </span>
                <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  LIVE SESSION
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-sky-200 terminal-prompt tracking-tight">
                WELCOME BACK, {user?.username?.toUpperCase() || 'STUDENT'}
              </h1>
              <p className="text-sm text-sky-400/80 mt-1.5 max-w-xl leading-relaxed">
                Your AI coding workspace is primed. Ready to solve algorithms, debug code, or learn new concepts today?
              </p>
            </div>

            {/* Student Level & XP Pill */}
            <div className="flex items-center gap-4 bg-slate-950/90 border border-sky-700/40 p-4 rounded-2xl shrink-0 shadow-lg shadow-black/60">
              <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600 p-0.5 shadow-md shadow-sky-500/25 flex items-center justify-center text-xl font-bold text-slate-950">
                <span className="bg-slate-950 w-full h-full rounded-[10px] flex items-center justify-center text-cyan-300 text-lg">
                  {user?.level || 2}
                </span>
              </div>
              <div>
                <div className="text-[11px] text-sky-500 font-semibold">Current Rank</div>
                <div className="text-sm font-bold text-sky-200">Level {user?.level || 2} Coder</div>
                <div className="text-[11px] text-amber-300 font-bold mt-0.5">⚡ {user?.xp || 350} Total XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 CORE LEARNING METRICS STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="terminal-card p-4.5 rounded-2xl border border-sky-800/30 bg-slate-950/85 hover:border-sky-500/50 transition-all duration-300 shadow-lg">
            <div className="text-xs text-sky-500 mb-1.5 flex items-center justify-between">
              <span className="font-semibold">Problems Solved</span>
              <span className="text-base">📝</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-200">
              {user?.problemsSolved?.length || 4}
            </div>
            <div className="text-[11px] text-sky-600 mt-1">
              Across Python, C, Java, JS
            </div>
          </div>

          <div className="terminal-card p-4.5 rounded-2xl border border-sky-800/30 bg-slate-950/85 hover:border-sky-500/50 transition-all duration-300 shadow-lg">
            <div className="text-xs text-sky-500 mb-1.5 flex items-center justify-between">
              <span className="font-semibold">Concepts Learned</span>
              <span className="text-base">📚</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300">
              {user?.completedLessons?.length || 7}
            </div>
            <div className="text-[11px] text-sky-600 mt-1">
              Curriculum modules mastered
            </div>
          </div>

          <div className="terminal-card p-4.5 rounded-2xl border border-sky-800/30 bg-slate-950/85 hover:border-sky-500/50 transition-all duration-300 shadow-lg">
            <div className="text-xs text-sky-500 mb-1.5 flex items-center justify-between">
              <span className="font-semibold">Quiz Accuracy</span>
              <span className="text-base">🎯</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-200">
              {user?.quizStats?.accuracy || 82}%
            </div>
            <div className="text-[11px] text-sky-600 mt-1">
              {user?.quizStats?.totalCorrect || 23} / {user?.quizStats?.totalAnswered || 28} questions
            </div>
          </div>

          <div className="terminal-card p-4.5 rounded-2xl border border-sky-800/30 bg-slate-950/85 hover:border-sky-500/50 transition-all duration-300 shadow-lg">
            <div className="text-xs text-sky-500 mb-1.5 flex items-center justify-between">
              <span className="font-semibold">Current Streak</span>
              <span className="text-base">🔥</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {user?.streak || 5} Days
            </div>
            <div className="text-[11px] text-sky-600 mt-1">
              Active daily momentum
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS PANEL */}
        <div className="terminal-card p-5 rounded-2xl border border-sky-800/40 bg-slate-950/90 shadow-xl">
          <div className="text-xs text-sky-500 font-bold mb-3.5 flex items-center gap-2">
            <span className="text-cyan-400 font-extrabold">~/actions/launcher.sh</span>
            <span className="text-sky-700">— Quick Action Launcher</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              href="/workspace?tab=explain"
              className="terminal-button text-xs py-3.5 px-2 text-center rounded-xl flex flex-col items-center gap-1.5 hover:border-sky-400 group bg-sky-950/40 border-sky-800/50"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🧠</span>
              <span className="text-sky-200 font-bold">Explain Code</span>
            </Link>

            <Link
              href="/workspace?tab=debug"
              className="terminal-button text-xs py-3.5 px-2 text-center rounded-xl flex flex-col items-center gap-1.5 hover:border-amber-400 group bg-amber-950/20 border-amber-800/40"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🐞</span>
              <span className="text-amber-300 font-bold">Debug Code</span>
            </Link>

            <Link
              href="/workspace?tab=output"
              className="terminal-button text-xs py-3.5 px-2 text-center rounded-xl flex flex-col items-center gap-1.5 hover:border-cyan-400 group bg-cyan-950/30 border-cyan-800/50"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">▶</span>
              <span className="text-cyan-300 font-bold">Run Code</span>
            </Link>

            <Link
              href="/learn"
              className="terminal-button text-xs py-3.5 px-2 text-center rounded-xl flex flex-col items-center gap-1.5 hover:border-sky-400 group bg-sky-950/40 border-sky-800/50"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📚</span>
              <span className="text-sky-200 font-bold">Learn</span>
            </Link>

            <Link
              href="/practice"
              className="terminal-button text-xs py-3.5 px-2 text-center rounded-xl flex flex-col items-center gap-1.5 hover:border-indigo-400 group bg-indigo-950/30 border-indigo-800/50"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📝</span>
              <span className="text-indigo-200 font-bold">Practice</span>
            </Link>

            <Link
              href="/quiz"
              className="terminal-button text-xs py-3.5 px-2 text-center rounded-xl flex flex-col items-center gap-1.5 hover:border-yellow-400 group bg-yellow-950/20 border-yellow-800/40"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🧪</span>
              <span className="text-yellow-200 font-bold">Quiz</span>
            </Link>
          </div>
        </div>

        {/* TWO COLUMN SECTION: Language Progress & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Language Mastery Progress */}
          <div className="lg:col-span-7 terminal-card p-5.5 rounded-2xl border border-sky-800/40 bg-slate-950/90 space-y-4.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-sky-900/30 pb-3">
              <h2 className="text-sm font-bold text-sky-300 flex items-center gap-2">
                <span>📊</span>
                <span>YOUR PROGRESS BY LANGUAGE</span>
              </h2>
              <Link href="/progress" className="text-xs text-cyan-400 hover:text-cyan-200 underline">
                View detailed metrics ❯
              </Link>
            </div>

            {/* Language Progress Bars */}
            <div className="space-y-4 text-xs">
              {/* Python */}
              <div>
                <div className="flex justify-between text-sky-200 mb-1.5">
                  <span className="font-bold flex items-center gap-2">
                    <span className="text-yellow-400">🐍</span> Python
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{progress.python}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-sky-900/40">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 rounded-full transition-all duration-500 shadow-sm shadow-cyan-500"
                    style={{ width: `${progress.python}%` }}
                  />
                </div>
              </div>

              {/* C */}
              <div>
                <div className="flex justify-between text-sky-200 mb-1.5">
                  <span className="font-bold flex items-center gap-2">
                    <span className="text-blue-400">⚙</span> C
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{progress.c}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-sky-900/40">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 rounded-full transition-all duration-500 shadow-sm shadow-blue-500"
                    style={{ width: `${progress.c}%` }}
                  />
                </div>
              </div>

              {/* Java */}
              <div>
                <div className="flex justify-between text-sky-200 mb-1.5">
                  <span className="font-bold flex items-center gap-2">
                    <span className="text-orange-400">☕</span> Java
                  </span>
                  <span className="font-mono text-orange-400 font-bold">{progress.java}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-sky-900/40">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500 shadow-sm shadow-orange-500"
                    style={{ width: `${progress.java}%` }}
                  />
                </div>
              </div>

              {/* JavaScript */}
              <div>
                <div className="flex justify-between text-sky-200 mb-1.5">
                  <span className="font-bold flex items-center gap-2">
                    <span className="text-yellow-300">⚡</span> JavaScript
                  </span>
                  <span className="font-mono text-yellow-300 font-bold">{progress.javascript}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-sky-900/40">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 via-amber-400 to-sky-400 rounded-full transition-all duration-500 shadow-sm shadow-yellow-500"
                    style={{ width: `${progress.javascript}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Recommended Challenge Banner */}
            <div className="mt-4 p-4.5 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/60 to-slate-900 border border-sky-600/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <span className="text-[10px] text-cyan-300 font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 tracking-wider">
                  RECOMMENDED PRACTICE
                </span>
                <h3 className="text-sm font-bold text-sky-100 mt-1.5">Palindrome Checker</h3>
                <p className="text-xs text-sky-400/80">Strings / Two Pointers • Medium (50 XP)</p>
              </div>
              <Link
                href="/practice?problem=palindrome-checker"
                className="terminal-button text-xs py-2 px-4 whitespace-nowrap bg-sky-500/30 hover:bg-sky-500/50 text-sky-100 font-bold border-sky-400 shadow-md"
              >
                Solve Challenge ❯
              </Link>
            </div>
          </div>

          {/* Right Column: Recent Activity Feed */}
          <div className="lg:col-span-5 terminal-card p-5.5 rounded-2xl border border-sky-800/40 bg-slate-950/90 flex flex-col shadow-xl">
            <div className="flex items-center justify-between border-b border-sky-900/30 pb-3 mb-3">
              <h2 className="text-sm font-bold text-sky-300 flex items-center gap-2">
                <span>🕒</span>
                <span>RECENT ACTIVITY</span>
              </h2>
              <span className="text-[10px] text-sky-600 font-mono">Real-time log</span>
            </div>

            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[300px] text-xs">
              {(user?.recentActivity && user.recentActivity.length > 0) ? (
                user.recentActivity.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-sky-900/40 flex items-center justify-between gap-2.5 hover:border-sky-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-cyan-400 font-extrabold">✓</span>
                      <span className="text-sky-200 truncate">{act.title}</span>
                    </div>
                    <span className="text-[11px] text-amber-300 font-mono font-bold shrink-0">
                      +{act.xpEarned} XP
                    </span>
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-sky-900/40 flex items-center justify-between text-sky-200">
                    <span>✓ Completed Python Loops</span>
                    <span className="text-amber-300 font-bold">+25 XP</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-sky-900/40 flex items-center justify-between text-sky-200">
                    <span>✓ Debugged Array Error</span>
                    <span className="text-amber-300 font-bold">+15 XP</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-sky-900/40 flex items-center justify-between text-sky-200">
                    <span>✓ Functions Quiz (100%)</span>
                    <span className="text-amber-300 font-bold">+30 XP</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-sky-900/40 flex items-center justify-between text-sky-200">
                    <span>✓ List Practice Challenge</span>
                    <span className="text-amber-300 font-bold">+50 XP</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-sky-900/30 flex justify-between items-center text-[11px] text-sky-600 font-mono">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Session synced</span>
              <Link href="/tutor" className="text-cyan-400 hover:text-cyan-200 font-bold">
                Ask AI Tutor ❯
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}