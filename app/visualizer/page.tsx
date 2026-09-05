'use client';

import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import CodeEditor from '@/components/CodeEditor';
import { ExecutionStep } from '@/lib/services/ai';

const SAMPLE_VISUALIZER_CODE = {
  python: `x = 5

for i in range(3):
    x = x + i
    print(f"i={i}, x={x}")

print(f"Final: {x}")`,
  javascript: `let x = 5;

for (let i = 0; i < 3; i++) {
    x = x + i;
    console.log(\`i=\${i}, x=\${x}\`);
}

console.log(\`Final: \${x}\`);`,
  c: `#include <stdio.h>

int main() {
    int x = 5;
    for (int i = 0; i < 3; i++) {
        x = x + i;
        printf("i=%d, x=%d\\n", i, x);
    }
    printf("Final: %d\\n", x);
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        int x = 5;
        for (int i = 0; i < 3; i++) {
            x = x + i;
            System.out.println("i=" + i + ", x=" + x);
        }
        System.out.println("Final: " + x);
    }
}`
};

export default function VisualizerPage() {
  const [language, setLanguage] = useState<'python' | 'javascript' | 'c' | 'java'>('python');
  const [code, setCode] = useState(SAMPLE_VISUALIZER_CODE.python);
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200); // ms per step
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    handleGenerateTrace();
  }, [language]);

  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, steps.length, speed]);

  const handleGenerateTrace = async () => {
    setIsLoading(true);
    setIsPlaying(false);
    setCurrentStepIndex(0);

    try {
      const res = await fetch('/api/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      const generatedSteps: ExecutionStep[] = data.steps || [];
      setSteps(generatedSteps);

      // Accumulate output logs
      const accumulatedLogs = generatedSteps
        .filter((s) => s.output)
        .map((s) => s.output);
      setLogs(accumulatedLogs);
    } catch (err) {
      console.error('Visualizer trace failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (newLang: 'python' | 'javascript' | 'c' | 'java') => {
    setLanguage(newLang);
    setCode(SAMPLE_VISUALIZER_CODE[newLang]);
  };

  const currentStep = steps[currentStepIndex];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono">
        {/* Header Banner */}
        <div className="terminal-card p-6 rounded-2xl border border-indigo-700/40 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">🔍</span>
              <h1 className="text-xl font-extrabold text-sky-200 terminal-prompt">
                CODE EXECUTION VISUALIZER
              </h1>
            </div>
            <p className="text-xs text-sky-400/80">
              Watch variable states mutate in real-time and trace the call sequence step-by-step.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateTrace}
              disabled={isLoading}
              className="terminal-button text-xs py-2.5 px-4.5 bg-sky-500/30 text-sky-100 border-sky-400 font-bold flex items-center gap-2 shadow-lg shadow-sky-950"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-sky-300 border-t-transparent rounded-full animate-spin" />
                  <span>Tracing...</span>
                </>
              ) : (
                <>
                  <span className="text-cyan-400">⚡</span>
                  <span>Re-Generate Trace</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* MAIN VISUALIZER WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Code Editor with Active Line Highlighting (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              activeLine={currentStep ? currentStep.lineNumber : null}
              showToolbar={false}
              minHeight="360px"
            />

            {/* Playback Control Bar */}
            <div className="terminal-card p-4.5 rounded-2xl border border-sky-800/40 bg-slate-950/95 space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-extrabold uppercase">
                  STEP {steps.length > 0 ? currentStepIndex + 1 : 0} OF {steps.length}
                </span>

                {/* Speed selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-sky-600">Speed:</span>
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="bg-slate-900 border border-sky-800/50 rounded-lg px-2.5 py-1 text-xs text-sky-200 font-mono outline-none"
                  >
                    <option value={2000}>0.5x (Slow)</option>
                    <option value={1200}>1.0x (Normal)</option>
                    <option value={600}>2.0x (Fast)</option>
                  </select>
                </div>
              </div>

              {/* Progress Slider */}
              <input
                type="range"
                min={0}
                max={Math.max(steps.length - 1, 0)}
                value={currentStepIndex}
                onChange={(e) => {
                  setCurrentStepIndex(Number(e.target.value));
                  setIsPlaying(false);
                }}
                disabled={steps.length <= 1}
                className="w-full accent-cyan-400 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />

              {/* Control Buttons: Previous, Play/Pause, Next, Reset */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <button
                  disabled={currentStepIndex === 0 || steps.length === 0}
                  onClick={() => {
                    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
                    setIsPlaying(false);
                  }}
                  className="terminal-button text-xs py-1.5 px-4 disabled:opacity-40"
                >
                  ⏮ Previous
                </button>

                <button
                  disabled={steps.length === 0}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="terminal-button text-xs py-1.5 px-6 bg-sky-500/30 text-sky-100 font-bold border-sky-400 shadow-md"
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>

                <button
                  disabled={currentStepIndex >= steps.length - 1 || steps.length === 0}
                  onClick={() => {
                    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
                    setIsPlaying(false);
                  }}
                  className="terminal-button text-xs py-1.5 px-4 disabled:opacity-40"
                >
                  Next ⏭
                </button>

                <button
                  onClick={() => {
                    setCurrentStepIndex(0);
                    setIsPlaying(false);
                  }}
                  className="text-xs text-sky-600 hover:text-sky-300 px-3 py-1.5"
                >
                  ↺ Reset
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Execution State, Variables Watcher & Output (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Step Explanation Card */}
            <div className="terminal-card p-5.5 rounded-2xl border border-indigo-700/40 bg-slate-950/95 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-indigo-900/30 pb-3">
                <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  CURRENT STEP {currentStep ? `#${currentStep.step}` : ''}
                </h3>
                {currentStep && (
                  <span className="text-xs text-cyan-300 font-bold font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800">
                    Line {currentStep.lineNumber}
                  </span>
                )}
              </div>

              {currentStep ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-indigo-900/50 flex items-center justify-between">
                    <span className="text-[11px] text-sky-600 font-mono">Executing Statement:</span>
                    <code className="text-xs text-cyan-300 font-bold">{currentStep.codeSnippet}</code>
                  </div>
                  <p className="text-xs text-sky-200 leading-relaxed">
                    {currentStep.explanation}
                  </p>
                </div>
              ) : (
                <div className="py-10 text-center text-xs text-sky-700">
                  Ready to visualize. Click &quot;Re-Generate Trace&quot;.
                </div>
              )}
            </div>

            {/* Variable Memory Watcher Table */}
            <div className="terminal-card p-5.5 rounded-2xl border border-sky-800/40 bg-slate-950/95 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-sky-900/30 pb-3">
                <h3 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2">
                  <span>💾</span>
                  <span>VARIABLE WATCHER (SCOPE)</span>
                </h3>
                <span className="text-[11px] text-sky-600">Live Stack Frame</span>
              </div>

              {currentStep && Object.keys(currentStep.variables).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(currentStep.variables).map(([name, value]) => (
                    <div
                      key={name}
                      className="p-3.5 rounded-xl bg-slate-900 border border-sky-700/40 flex items-center justify-between shadow-md"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="font-bold text-sky-200">{name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-sky-600">→</span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-sky-950 border border-sky-500/50 text-cyan-300 font-bold shadow-sm">
                          {String(value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-sky-700 italic">
                  No local variables initialized at this step.
                </div>
              )}
            </div>

            {/* Visualizer Console Output */}
            <div className="terminal-card p-5.5 rounded-2xl border border-cyan-800/40 bg-slate-950/95 space-y-2.5 shadow-xl">
              <div className="flex items-center justify-between border-b border-cyan-900/30 pb-2 text-xs">
                <span className="font-bold text-cyan-300">TERMINAL CONSOLE STREAM</span>
                <span className="text-[10px] text-sky-600">Accumulated Output</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-900/30 font-mono text-xs text-sky-200 min-h-[80px] max-h-[140px] overflow-y-auto">
                {logs.length > 0 ? (
                  logs.map((line, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-sky-800 italic">No output emitted yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
