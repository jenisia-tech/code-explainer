'use client';

import { useState, useRef, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeSnippet?: string;
}

const QUICK_PROMPTS = [
  'Why is my loop not working?',
  'What is inheritance in OOP?',
  'Explain this code like I am a beginner.',
  'Why am I getting an IndexError in Python?',
  'Give me a progressive hint on solving binary search.',
  'What topic should I learn next after Functions?'
];

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `Hello! I am your AI Coding Tutor. 🤖\n\nI can help you understand tricky concepts, debug logic errors, and guide your thinking with the Socratic method.\n\nAsk any question or pick a prompt chip below to get started!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [codeContext, setCodeContext] = useState('');
  const [language, setLanguage] = useState('python');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      codeSnippet: codeContext.trim() || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          currentCode: codeContext.trim() || undefined,
          language,
          chatHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const reply = data.reply || 'I am ready to help you with your code!';

      const assistantMessage: Message = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          role: 'assistant',
          content: `I encountered an issue connecting to the mentor service: ${err.message || 'Please try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-140px)] font-mono space-y-4">
        {/* Header Bar */}
        <div className="terminal-card p-4 rounded-xl border border-sky-800/40 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-950/70 border border-cyan-500/50 flex items-center justify-center text-lg shadow-sm shadow-cyan-950">
              🤖
            </div>
            <div>
              <h1 className="text-sm font-bold text-sky-300">AI CODING TUTOR & MENTOR</h1>
              <p className="text-[11px] text-sky-400/70">Socratic guidance • Context-aware debugging assistance</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-900 border border-sky-800/40 rounded px-2.5 py-1 text-sky-200 font-mono outline-none focus:border-sky-400"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="c">C</option>
              <option value="java">Java</option>
            </select>

            <button
              onClick={() => setShowCodeInput(!showCodeInput)}
              className={`px-3 py-1 rounded text-xs transition-all ${
                showCodeInput || codeContext
                  ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-400/50 font-bold shadow-sm shadow-cyan-950'
                  : 'text-sky-400/70 border border-sky-800/40 hover:text-sky-200 hover:border-sky-500/40'
              }`}
            >
              {codeContext ? '✓ Code Attached' : '+ Attach Code'}
            </button>
          </div>
        </div>

        {/* Optional Attached Code Context Panel */}
        {showCodeInput && (
          <div className="terminal-card p-3 rounded-xl border border-sky-800/40 bg-slate-950 space-y-2 shrink-0 animate-fadeIn">
            <div className="flex justify-between items-center text-xs">
              <span className="text-cyan-300 font-bold">~/context/student_code.{language}</span>
              <button
                onClick={() => setCodeContext('')}
                className="text-[11px] text-rose-400 hover:underline"
              >
                Clear Context
              </button>
            </div>
            <textarea
              value={codeContext}
              onChange={(e) => setCodeContext(e.target.value)}
              placeholder={`// Paste your ${language} code snippet here for contextual tutor guidance...`}
              className="w-full h-24 p-2.5 bg-slate-900 border border-sky-800/40 rounded text-xs text-sky-200 font-mono outline-none resize-none focus:border-sky-400"
            />
          </div>
        )}

        {/* Chat Message Stream */}
        <div className="terminal-card flex-1 p-4 rounded-xl border border-sky-800/40 bg-slate-950/90 overflow-y-auto space-y-4 terminal-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs leading-relaxed ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-md bg-sky-950 border border-cyan-600/50 flex items-center justify-center text-sm shrink-0 shadow-sm shadow-cyan-950">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-xl p-3.5 space-y-2 ${
                    isUser
                      ? 'bg-sky-950/80 border border-sky-500/50 text-sky-100 shadow-md shadow-sky-950/40'
                      : 'bg-slate-900/90 border border-sky-800/40 text-sky-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[10px] text-sky-400/70 border-b border-sky-800/30 pb-1 font-mono">
                    <span className="font-bold">{isUser ? 'You' : 'Antigravity Tutor'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {msg.codeSnippet && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-cyan-300 font-bold">ATTACHED CODE:</span>
                      <pre className="p-2 rounded bg-slate-950 border border-sky-800/40 text-cyan-300 overflow-x-auto text-[11px]">
                        {msg.codeSnippet}
                      </pre>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-md bg-sky-900/50 border border-sky-400/50 flex items-center justify-center text-xs font-bold text-sky-200 shrink-0 shadow-sm shadow-sky-950">
                    👤
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-cyan-300 animate-pulse">
              <div className="w-7 h-7 rounded-md bg-sky-950 border border-cyan-600/50 flex items-center justify-center text-sm shrink-0">
                🤖
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-sky-800/40 flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>Formulating guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs shrink-0 terminal-scrollbar">
          <span className="text-sky-400/60 text-[11px] shrink-0 font-mono">$ prompts:</span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-slate-900/90 border border-sky-800/40 text-sky-300 hover:text-sky-100 hover:border-sky-400/60 hover:bg-sky-950/50 transition-all shrink-0 shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ask your tutor anything (e.g. 'Why is my loop skipping the last element?')..."
            className="flex-1 p-3 bg-slate-950/90 border border-sky-800/40 rounded-xl text-xs text-sky-100 font-mono outline-none focus:border-sky-400 placeholder:text-sky-400/40"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="terminal-button text-xs py-3 px-5 bg-sky-500/25 text-sky-100 font-bold border-sky-400/50 hover:bg-sky-500/40 disabled:opacity-40 shrink-0 shadow-lg shadow-sky-950/40"
          >
            Send ❯
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
