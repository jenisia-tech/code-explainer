'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState('');
  const [isReady, setIsReady] = useState(false);
  const isRegistered = searchParams.get('registered');

  useEffect(() => {
    if (isRegistered) {
      setInfo('Account registered successfully. Please login.');
    }
  }, [isRegistered]);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setInfo('Login successful — redirecting...');
      setTimeout(() => {
        const target = redirectPath && redirectPath !== '/login' ? redirectPath : '/';
        window.location.assign(target);
      }, 700);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="loading-screen bg-[#020617]">
        <div className="text-center space-y-4">
          <div className="loader mx-auto" />
          <p className="text-sm text-sky-300">Loading secure terminal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-sky-200 flex items-center justify-center p-4 pixel-game-bg">
      <div className="w-full max-w-md">
        {/* Terminal Header */}
        <div className="terminal-card terminal-window border border-sky-800/40 bg-slate-950/90 shadow-2xl shadow-sky-950/40">
          <div className="terminal-window-header border-b border-sky-800/30 pb-2 mb-4">
            <span className="circle red" />
            <span className="circle yellow" />
            <span className="circle green" />
            <span className="text-xs text-sky-400/60 ml-2 font-mono">
              guest@code-explainer:~$ ssh login
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2 text-sky-300 terminal-prompt">
            Authentication Required
          </h1>
          <p className="text-sky-400/70 text-xs mb-1">
            [INFO] Enter credentials to access the AI learning terminal
          </p>
        </div>

        {/* Login Form */}
        <div className="terminal-card mt-6 border border-sky-800/40 bg-slate-950/90 shadow-2xl shadow-sky-950/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-950/50 border border-rose-800/50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 text-sm mt-0.5">❯</span>
                  <div>
                    <p className="text-rose-300 text-xs font-semibold">$ ERROR</p>
                    <p className="text-rose-200 text-xs mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {info && (
              <div className="bg-sky-950/60 border border-sky-600/50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 text-sm mt-0.5">❯</span>
                  <div>
                    <p className="text-sky-300 text-xs font-semibold">$ INFO</p>
                    <p className="text-sky-100 text-xs mt-1">{info}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs text-sky-400/70 mb-1.5">
                $ email
              </label>
              <input
                autoFocus
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="terminal-input w-full"
                placeholder="student@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs text-sky-400/70 mb-1.5">
                $ password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="terminal-input w-full"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="terminal-button w-full flex items-center justify-center gap-2 py-3 bg-sky-500/25 text-sky-100 font-bold border-sky-400/50 hover:bg-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-950/40"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></span>
                  <span>$ authenticating...</span>
                </>
              ) : (
                <>
                  <span className="text-cyan-400">❯</span>
                  <span>$ login --authenticate</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-sky-800/30">
            <p className="text-sky-400/70 text-xs">
              $ new-user?{' '}
              <Link
                href="/register"
                className="text-cyan-400 hover:text-cyan-200 underline underline-offset-4 font-bold"
              >
                register --create-account
              </Link>
            </p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 pt-4 border-t border-sky-800/30">
          <div className="flex justify-between text-xs text-sky-400/60 font-mono">
            <span>[SYSTEM] Auth required</span>
            <span>guest@code-explainer</span>
          </div>
        </div>
      </div>
    </div>
  );
}