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
      setTimeout(() => { window.location.href = redirectPath; }, 700);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="loading-screen">
        <div className="text-center space-y-4">
          <div className="loader mx-auto" />
          <p className="text-sm text-green-300">Loading secure terminal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Terminal Header */}
        <div className="terminal-card terminal-window">
          <div className="terminal-window-header">
            <span className="circle red" />
            <span className="circle yellow" />
            <span className="circle green" />
            <span className="text-xs text-green-600 ml-2">
              guest@code-explainer:~$ ssh login
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2 text-green-300 terminal-prompt">
            Authentication Required
          </h1>
          <p className="text-green-600 text-sm mb-1">
            [INFO] Enter credentials to access the system
          </p>
        </div>

        {/* Login Form */}
        <div className="terminal-card mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-950/50 border border-red-800/50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 text-sm mt-0.5">❯</span>
                  <div>
                    <p className="text-red-400 text-sm font-semibold">$ ERROR</p>
                    <p className="text-red-300 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {info && (
              <div className="bg-green-950/40 border border-green-800/40 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-green-400 text-sm mt-0.5">❯</span>
                  <div>
                    <p className="text-green-300 text-sm font-semibold">$ INFO</p>
                    <p className="text-green-200 text-sm mt-1">{info}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs text-green-600 mb-1.5">
                $ email
              </label>
              <input
                autoFocus
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="terminal-input w-full"
                placeholder="user@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs text-green-600 mb-1.5">
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
              className="terminal-button w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></span>
                  <span>$ authenticating...</span>
                </>
              ) : (
                <>
                  <span className="text-green-500">❯</span>
                  <span>$ login --authenticate</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-green-800/30">
            <p className="text-green-600 text-sm">
              $ new-user?{' '}
              <Link
                href="/register"
                className="text-green-400 hover:text-green-300 underline underline-offset-4"
              >
                register --create-account
              </Link>
            </p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 pt-4 border-t border-green-800/30">
          <div className="flex justify-between text-xs text-green-700">
            <span>[SYSTEM] Auth required</span>
            <span>guest@code-explainer</span>
          </div>
        </div>
      </div>
    </div>
  );
}