'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';

export default function SettingsPage() {
  const [username, setUsername] = useState('StudentCoder');
  const [email, setEmail] = useState('student@code-explainer.dev');
  const [defaultLanguage, setDefaultLanguage] = useState('python');
  const [explanationLevel, setExplanationLevel] = useState('beginner');
  const [customApiKey, setCustomApiKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'saving'>('idle');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUsername(data.user.username || 'StudentCoder');
          setEmail(data.user.email || 'student@code-explainer.dev');
          if (data.user.preferences) {
            setDefaultLanguage(data.user.preferences.defaultLanguage || 'python');
            setExplanationLevel(data.user.preferences.explanationLevel || 'beginner');
            setCustomApiKey(data.user.preferences.customApiKey || '');
          }
        }
      }
    } catch (err) {
      console.error('Failed to load user settings', err);
    }
  };

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }, 500);
  };

  return (
    <AppLayout>
      <div className="space-y-6 font-mono max-w-4xl mx-auto">
        {/* Header */}
        <div className="terminal-card p-5 rounded-xl border border-sky-800/40 bg-slate-950/90 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base text-cyan-400">⚙</span>
              <h1 className="text-xl font-bold text-sky-300 terminal-prompt">
                STUDENT SETTINGS & PREFERENCES
              </h1>
            </div>
            <p className="text-xs text-sky-400/70">
              Manage your student profile, AI customization, and learning environment settings.
            </p>
          </div>
        </div>

        {/* 1. STUDENT PROFILE & PRIVACY */}
        <div className="terminal-card p-6 rounded-2xl border border-sky-800/40 bg-slate-950/90 space-y-4 shadow-xl shadow-sky-950/30">
          <div className="border-b border-sky-800/30 pb-3">
            <h2 className="text-sm font-bold text-sky-300 flex items-center gap-2">
              <span>👤</span>
              <span>STUDENT IDENTITY & PRIVACY</span>
            </h2>
            <p className="text-[11px] text-sky-400/60 mt-0.5">
              Account details are safely stored and kept private from the public dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-sky-400/70 mb-1">$ username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="terminal-input w-full"
              />
            </div>

            <div>
              <label className="block text-sky-400/70 mb-1">$ email (private)</label>
              <input
                type="email"
                value={email}
                disabled
                className="terminal-input w-full opacity-60 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* 2. LEARNING & AI PREFERENCES */}
        <div className="terminal-card p-6 rounded-2xl border border-sky-800/40 bg-slate-950/90 space-y-4 shadow-xl shadow-sky-950/30">
          <div className="border-b border-sky-800/30 pb-3">
            <h2 className="text-sm font-bold text-sky-300 flex items-center gap-2">
              <span>🧠</span>
              <span>AI TUTOR & EXPLAINER CONFIGURATION</span>
            </h2>
            <p className="text-[11px] text-sky-400/60 mt-0.5">
              Customize how AI explanations and debugging feedback are tailored to you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-sky-400/70 mb-1">$ default language</label>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className="terminal-input w-full"
              >
                <option value="python">Python (py)</option>
                <option value="c">C (gcc)</option>
                <option value="java">Java (jdk)</option>
                <option value="javascript">JavaScript (js)</option>
              </select>
            </div>

            <div>
              <label className="block text-sky-400/70 mb-1">$ explanation depth</label>
              <select
                value={explanationLevel}
                onChange={(e) => setExplanationLevel(e.target.value)}
                className="terminal-input w-full"
              >
                <option value="beginner">Beginner (Simple analogies, step-by-step)</option>
                <option value="intermediate">Intermediate (Standard developer technical breakdown)</option>
                <option value="advanced">Advanced (Deep algorithmic & memory analysis)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sky-400/70 mb-1">
              $ custom groq api key (optional override)
            </label>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="gsk_..."
              className="terminal-input w-full"
            />
            <p className="text-[10px] text-sky-400/60 mt-1">
              If left blank, the platform uses the system default LLaMA 3.1 AI key.
            </p>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleSaveSettings}
            disabled={saveStatus === 'saving'}
            className="terminal-button text-xs py-2.5 px-6 bg-sky-500/25 text-sky-100 font-bold border-sky-400/50 hover:bg-sky-500/40 shadow-lg shadow-sky-950/40"
          >
            {saveStatus === 'saving'
              ? 'Saving...'
              : saveStatus === 'saved'
              ? '✓ Preferences Saved'
              : 'Save Preferences ❯'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
