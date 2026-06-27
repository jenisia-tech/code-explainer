'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (formData.username.length < 3) {
      newErrors.push('Username must be at least 3 characters long');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.push('Username can only contain letters, numbers, and underscores');
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.push('Please enter a valid email address');
    }
    if (formData.password.length < 6) {
      newErrors.push('Password must be at least 6 characters long');
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setInfo('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          setErrors(data.details);
        } else {
          setErrors([data.error || 'Registration failed']);
        }
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to login page on success
      setInfo('Account created — redirecting to login...');
      setTimeout(() => router.push('/login?registered=true'), 900);
    } catch (err: any) {
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="loading-screen">
        <div className="text-center space-y-4">
          <div className="loader mx-auto" />
          <p className="text-sm text-green-300">Loading auth system...</p>
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
              guest@code-explainer:~$ useradd
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2 text-green-300 terminal-prompt">
            Create New Account
          </h1>
          <p className="text-green-600 text-sm mb-1">
            [INFO] Register to access the code analysis system
          </p>
        </div>

        {/* Registration Form */}
        <div className="terminal-card mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.length > 0 && (
              <div className="bg-red-950/50 border border-red-800/50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 text-sm mt-0.5">❯</span>
                  <div>
                    <p className="text-red-400 text-sm font-semibold">$ VALIDATION ERRORS</p>
                    <ul className="text-red-300 text-sm mt-1 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          {error}
                        </li>
                      ))}
                    </ul>
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
              <label htmlFor="username" className="block text-xs text-green-600 mb-1.5">
                $ username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="terminal-input w-full"
                placeholder="linux_user"
                required
                disabled={isLoading}
                minLength={3}
                maxLength={30}
                pattern="[a-zA-Z0-9_]+"
                title="Only letters, numbers, and underscores allowed"
              />
              <p className="text-green-700 text-xs mt-1">
                [3-30 chars, a-z, 0-9, _]
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs text-green-600 mb-1.5">
                $ email
              </label>
              <input
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
                minLength={6}
              />
              <p className="text-green-700 text-xs mt-1">
                [min 6 characters]
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs text-green-600 mb-1.5">
                $ confirm-password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="terminal-input w-full"
                placeholder="••••••••"
                required
                disabled={isLoading}
                minLength={6}
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
                  <span>$ creating user...</span>
                </>
              ) : (
                <>
                  <span className="text-green-500">❯</span>
                  <span>$ useradd --create-home</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-green-800/30">
            <p className="text-green-600 text-sm">
              $ existing-user?{' '}
              <Link
                href="/login"
                className="text-green-400 hover:text-green-300 underline underline-offset-4"
              >
                login --authenticate
              </Link>
            </p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 pt-4 border-t border-green-800/30">
          <div className="flex justify-between text-xs text-green-700">
            <span>[SYSTEM] New user registration</span>
            <span>guest@code-explainer</span>
          </div>
        </div>
      </div>
    </div>
  );
}