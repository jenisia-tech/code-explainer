'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getXpToNextLevel } from '@/lib/progress';

interface UserData {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  problemsSolved: string[];
  completedLessons: string[];
  quizStats: { accuracy: number };
  achievements: string[];
  preferences?: { defaultLanguage: string; explanationLevel: string };
}

interface AppLayoutProps {
  children: ReactNode;
  user?: UserData | null;
  onRefreshUser?: () => void;
}

export default function AppLayout({ children, user: initialUser, onRefreshUser }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(initialUser || null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    } else {
      fetchUser();
    }
  }, [initialUser]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.user) setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to load user in AppLayout', err);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      router.replace('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '▣' },
    { href: '/workspace', label: 'Code Workspace', icon: '💻' },
    { href: '/visualizer', label: 'Visualizer', icon: '🔍' },
    { href: '/learn', label: 'Learn', icon: '📚' },
    { href: '/practice', label: 'Practice', icon: '📝' },
    { href: '/quiz', label: 'Quizzes', icon: '🧪' },
    { href: '/tutor', label: 'AI Tutor', icon: '🤖' },
    { href: '/progress', label: 'Progress', icon: '📊' },
    { href: '/settings', label: 'Settings', icon: '⚙' },
  ];

  const xpInfo = getXpToNextLevel(user?.xp || 350);

  return (
    <div className="min-h-screen bg-slate-950 text-sky-400 flex flex-col md:flex-row pixel-game-bg">
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-sky-900/30 bg-slate-950/85 backdrop-blur-md shrink-0 shadow-2xl">
        {/* Brand / Terminal Header */}
        <div className="p-4 border-b border-sky-900/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 shadow-sm shadow-rose-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 shadow-sm shadow-amber-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50" />
            <span className="text-[11px] text-sky-600 ml-1 font-mono">v2.5.0-pro</span>
          </div>
          <Link href="/dashboard" className="block group">
            <h1 className="text-lg font-bold text-sky-300 terminal-prompt flex items-center gap-2 group-hover:text-sky-200 transition-colors">
              <span className="text-cyan-400 font-extrabold">❯</span> Code Explainer
            </h1>
            <p className="text-[11px] text-sky-600 font-mono mt-0.5">AI Interactive Coding Academy</p>
          </Link>
        </div>

        {/* Student Mini Profile */}
        <div className="p-3.5 mx-3 my-3 rounded-xl bg-slate-900/90 border border-sky-800/40 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-cyan-400 p-0.5 shadow-md shadow-sky-500/20 flex items-center justify-center text-xs font-bold text-slate-950">
                <span className="bg-slate-950 w-full h-full rounded-[6px] flex items-center justify-center text-sky-300">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'S'}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-sky-200 truncate max-w-[100px]">
                  {user?.username || 'Student'}
                </div>
                <div className="text-[10px] text-sky-500 font-mono">
                  Level {user?.level || 1} Coder
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-amber-950/40 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] text-amber-300 font-mono" title="Daily Streak">
              🔥 {user?.streak || 1}d
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-2.5">
            <div className="flex justify-between text-[10px] text-sky-500 mb-1 font-mono">
              <span>{user?.xp || 0} XP</span>
              <span className="text-cyan-400 font-semibold">{xpInfo.progressPercent}% to Lvl {(user?.level || 1) + 1}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-sky-900/40">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-400 rounded-full transition-all duration-500 shadow-sm shadow-sky-400"
                style={{ width: `${xpInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2.5 py-2 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-200 border border-sky-400/40 shadow-md shadow-sky-950/60 font-bold'
                    : 'text-sky-400/80 hover:bg-slate-900 hover:text-sky-200 hover:border-l-2 hover:border-sky-400'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-3.5 border-t border-sky-900/30 flex items-center justify-between text-xs bg-slate-950/40">
          <div className="text-[11px] text-sky-600 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>[ONLINE]</span>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-xs text-sky-500 hover:text-rose-400 transition-colors font-mono disabled:opacity-50"
          >
            $ logout
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <div className="md:hidden border-b border-sky-900/30 bg-slate-950/95 backdrop-blur px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">❯</span>
          <span className="text-sm font-bold text-sky-300">Code Explainer</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
            🔥 {user?.streak || 1}d
          </div>
          <div className="text-xs text-cyan-400 font-mono">
            ⚡ {user?.xp || 0}xp
          </div>
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="terminal-button text-xs py-1 px-2.5"
            aria-label="Toggle Navigation"
          >
            {isMobileNavOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-slate-950 border-b border-sky-800/40 p-4 space-y-2 z-40 sticky top-[53px] shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-2 mb-2 border-b border-sky-900/40 text-xs font-mono">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileNavOpen(false)}
                className={`flex items-center gap-2 p-2.5 rounded-lg ${
                  pathname === item.href
                    ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40 font-bold'
                    : 'text-sky-400 hover:bg-slate-900'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="flex justify-between items-center text-xs pt-1">
            <span className="text-sky-600">Student: {user?.username}</span>
            <button
              onClick={handleLogout}
              className="text-rose-400 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Status Header */}
        <header className="hidden md:flex items-center justify-between px-6 py-2.5 border-b border-sky-900/30 bg-slate-950/40 text-xs font-mono text-sky-600 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> academy.code-explainer.dev</span>
            <span>[SESSION] Active</span>
            <span>[TARGET] {user?.preferences?.defaultLanguage || 'python'}</span>
          </div>
          <div className="flex items-center gap-4 text-sky-400">
            <span>🔥 Streak: {user?.streak || 5} days</span>
            <span>⚡ XP: {user?.xp || 350}</span>
            <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-800/60 text-cyan-300 font-bold">🏅 Lvl {user?.level || 2}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
