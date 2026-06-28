'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      await fetchUser();
    };

    loadUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
      
      if (!response.ok) {
        if (response.status === 401) {
          router.replace('/login?redirect=/dashboard');
          return;
        }
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      router.replace('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-green-600 terminal-cursor">Loading user session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-green-400 flex items-center justify-center">
        <div className="terminal-card text-center">
          <p className="text-red-400 mb-4">$ ERROR: {error}</p>
          <button onClick={fetchUser} className="terminal-button">
            ❯ $ retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Terminal Header */}
        <div className="terminal-card mb-6">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-green-800/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-xs text-green-600 ml-2">
              {user?.username}@code-explainer:~$
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-green-300 terminal-prompt">
                Welcome, {user?.username}
              </h1>
              <p className="text-green-600 text-sm mt-1">
                [SYSTEM] Session active | {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="terminal-button text-sm"
            >
              ❯ $ logout
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="terminal-card mb-6">
          <h2 className="text-sm font-semibold text-green-500 mb-4">
            ~/user/info.txt
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="text-green-600 w-32">$ id:</span>
              <span className="text-green-400">{user?.id}</span>
            </div>
            <div className="flex">
              <span className="text-green-600 w-32">$ username:</span>
              <span className="text-green-400">{user?.username}</span>
            </div>
            <div className="flex">
              <span className="text-green-600 w-32">$ email:</span>
              <span className="text-green-400">{user?.email}</span>
            </div>
            <div className="flex">
              <span className="text-green-600 w-32">$ created:</span>
              <span className="text-green-400">
                {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="terminal-card">
          <h2 className="text-sm font-semibold text-green-500 mb-4">
            ~/actions/menu.sh
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="terminal-button text-sm">
              ❯ $ cd /code-explainer
            </Link>
            <button className="terminal-button text-sm">
              ❯ $ cat history
            </button>
            <button className="terminal-button text-sm">
              ❯ $ ls settings
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-8 pt-4 border-t border-green-800/30">
          <div className="flex flex-wrap justify-between text-xs text-green-700">
            <div className="flex gap-4">
              <span>[STATUS] Authenticated</span>
              <span>[USER] {user?.username}</span>
            </div>
            <div className="flex gap-4">
              <span>{user?.username}@code-explainer</span>
              <span>Session: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}