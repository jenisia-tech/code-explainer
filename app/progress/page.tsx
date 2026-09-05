'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import GamificationBadges from '@/components/GamificationBadges';
import { calculateLanguageProgress, getXpToNextLevel } from '@/lib/progress';

interface UserData {
  id: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
  problemsSolved: string[];
  completedLessons: string[];
  quizStats: { accuracy: number; totalAnswered: number; totalCorrect: number };
  achievements: string[];
}

export default function ProgressPage() {
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
    user?.problemsSolved || ['reverse-string', 'even-or-odd']
  );

  const xpInfo = getXpToNextLevel(user?.xp || 350);

  return (
    <AppLayout user={user as any}>
      <div className="space-y-6 font-mono">
        {/* Header Bar */}
        <div className="terminal-card p-5 rounded-xl border border-sky-800/40 bg-slate-950/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base text-cyan-400">📊</span>
              <h1 className="text-xl font-bold text-sky-300 terminal-prompt">
                STUDENT MASTERY & PROGRESS
              </h1>
            </div>
            <p className="text-xs text-sky-400/70">
              Track your skill development, accuracy metrics, and achievement milestones.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-sky-950/70 border border-sky-600/50 text-sky-200 font-bold shadow-sm shadow-sky-950">
              Level {user?.level || 2} Coder
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-600/50 text-amber-300 font-bold shadow-sm shadow-amber-950">
              🔥 {user?.streak || 5} Day Streak
            </div>
          </div>
        </div>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="terminal-card p-4 rounded-xl border border-sky-800/40 bg-slate-950/80 shadow-md shadow-sky-950/20">
            <div className="text-xs text-sky-400/70 mb-1">Total Experience (XP)</div>
            <div className="text-2xl font-bold text-amber-400">⚡ {user?.xp || 350}</div>
            <div className="text-[11px] text-sky-400/60 mt-1">
              {xpInfo.progressPercent}% toward Level {(user?.level || 1) + 1}
            </div>
          </div>

          <div className="terminal-card p-4 rounded-xl border border-sky-800/40 bg-slate-950/80 shadow-md shadow-sky-950/20">
            <div className="text-xs text-sky-400/70 mb-1">Problems Solved</div>
            <div className="text-2xl font-bold text-sky-200">{user?.problemsSolved?.length || 4}</div>
            <div className="text-[11px] text-sky-400/60 mt-1">Practice challenges cleared</div>
          </div>

          <div className="terminal-card p-4 rounded-xl border border-sky-800/40 bg-slate-950/80 shadow-md shadow-sky-950/20">
            <div className="text-xs text-sky-400/70 mb-1">Curriculum Lessons</div>
            <div className="text-2xl font-bold text-cyan-300">{user?.completedLessons?.length || 7}</div>
            <div className="text-[11px] text-sky-400/60 mt-1">Modules completed</div>
          </div>

          <div className="terminal-card p-4 rounded-xl border border-sky-800/40 bg-slate-950/80 shadow-md shadow-sky-950/20">
            <div className="text-xs text-sky-400/70 mb-1">Quiz Accuracy</div>
            <div className="text-2xl font-bold text-sky-300">{user?.quizStats?.accuracy || 82}%</div>
            <div className="text-[11px] text-sky-400/60 mt-1">
              {user?.quizStats?.totalCorrect || 23} correct answers
            </div>
          </div>
        </div>

        {/* LANGUAGE PROFICIENCY BARS */}
        <div className="terminal-card p-6 rounded-2xl border border-sky-800/40 bg-slate-950/90 space-y-4 shadow-xl shadow-sky-950/30">
          <div className="flex items-center justify-between border-b border-sky-800/30 pb-3">
            <h2 className="text-sm font-bold text-sky-300 flex items-center gap-2">
              <span>⚡</span>
              <span>LANGUAGE MASTERY BREAKDOWN</span>
            </h2>
            <span className="text-xs text-sky-400/60 font-mono">Weighted Proficiency</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1 text-sky-200">
                <span className="font-bold flex items-center gap-2">
                  <span>🐍</span> Python
                </span>
                <span className="font-mono text-cyan-300">{progress.python}% Mastery</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-sky-800/40">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-400 rounded-full transition-all duration-500 shadow-sm shadow-sky-400"
                  style={{ width: `${progress.python}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-cyan-200">
                <span className="font-bold flex items-center gap-2">
                  <span>⚙</span> C Programming
                </span>
                <span className="font-mono text-cyan-300">{progress.c}% Mastery</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-cyan-800/40">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-sky-400 rounded-full transition-all duration-500 shadow-sm shadow-cyan-400"
                  style={{ width: `${progress.c}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-indigo-200">
                <span className="font-bold flex items-center gap-2">
                  <span>☕</span> Java
                </span>
                <span className="font-mono text-cyan-300">{progress.java}% Mastery</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-indigo-800/40">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 rounded-full transition-all duration-500 shadow-sm shadow-indigo-400"
                  style={{ width: `${progress.java}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-sky-200">
                <span className="font-bold flex items-center gap-2">
                  <span>⚡</span> JavaScript
                </span>
                <span className="font-mono text-cyan-300">{progress.javascript}% Mastery</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-sky-800/40">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300 rounded-full transition-all duration-500 shadow-sm shadow-sky-400"
                  style={{ width: `${progress.javascript}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ACHIEVEMENTS & GAMIFICATION SECTION */}
        <div className="terminal-card p-6 rounded-2xl border border-sky-800/40 bg-slate-950/90 space-y-4 shadow-xl shadow-sky-950/30">
          <div className="flex items-center justify-between border-b border-sky-800/30 pb-3">
            <h2 className="text-sm font-bold text-sky-300 flex items-center gap-2">
              <span>🏅</span>
              <span>UNLOCKED ACHIEVEMENTS & BADGES</span>
            </h2>
            <span className="text-xs text-amber-400 font-bold font-mono">
              {user?.achievements?.length || 4} Unlocked
            </span>
          </div>

          <GamificationBadges unlockedIds={user?.achievements || ['first-program', 'bug-hunter', 'python-beginner', 'quiz-master']} />
        </div>
      </div>
    </AppLayout>
  );
}
