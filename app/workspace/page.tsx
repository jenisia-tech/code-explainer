'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import CodeEditor from '@/components/CodeEditor';
import OutputTerminal from '@/components/OutputTerminal';

type LanguageType = 'python' | 'javascript' | 'c' | 'java';
type TabType = 'explain' | 'debug' | 'hint' | 'visualize' | 'output';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

const INITIAL_CODE: Record<LanguageType, string> = {
  python: `numbers = [1, 2, 3, 4, 5]

for i in numbers:
    print(i)`,
  javascript: `const numbers = [1, 2, 3, 4, 5];

for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]);
}`,
  c: `#include <stdio.h>

int main() {
    int numbers[] = {1, 2, 3, 4, 5};
    for (int i = 0; i < 5; i++) {
        printf("%d\\n", numbers[i]);
    }
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        for (int i : numbers) {
            System.out.println(i);
        }
    }
}`
};

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabType) || 'explain';

  const [language, setLanguage] = useState<LanguageType>('python');
  const [code, setCode] = useState<string>(INITIAL_CODE.python);
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('beginner');

  // Execution & AI States
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [exitCode, setExitCode] = useState<number>(0);

  // Explanation State
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string>('');

  // Debug State
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugResult, setDebugResult] = useState<any>(null);
  const [debugViewMode, setDebugViewMode] = useState<'explain' | 'hint' | 'fix'>('explain');

  // Hint State
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [currentHintStep, setCurrentHintStep] = useState<number>(1);
  const [hintData, setHintData] = useState<any>(null);

  // Visualizer State
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [visSteps, setVisSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Sync tab with search params
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (tabParam && ['explain', 'debug', 'hint', 'visualize', 'output'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleLanguageChange = (newLang: LanguageType) => {
    setLanguage(newLang);
    setCode(INITIAL_CODE[newLang]);
    setOutput('');
    setError('');
    setExplanation('');
    setDebugResult(null);
    setHintData(null);
    setVisSteps([]);
  };

  // 1. RUN CODE
  const handleRunCode = async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setOutput('');
    setError('');
    setActiveTab('output');

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setOutput(data.output || '');
      setError(data.error || '');
      setExecutionTime(data.executionTimeMs || 0);
      setExitCode(data.exitCode ?? 0);
    } catch (err: any) {
      setError(err.message || 'Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  // 2. EXPLAIN CODE
  const handleExplainCode = async (selectedLevel = difficultyLevel) => {
    if (!code.trim()) return;
    setIsExplaining(true);
    setActiveTab('explain');

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, level: selectedLevel }),
      });
      const data = await res.json();
      setExplanation(data.explanation || 'No explanation generated.');
    } catch (err: any) {
      setExplanation(`$ error: ${err.message || 'Failed to analyze code.'}`);
    } finally {
      setIsExplaining(false);
    }
  };

  // 3. DEBUG CODE
  const handleDebugCode = async () => {
    if (!code.trim()) return;
    setIsDebugging(true);
    setActiveTab('debug');
    setDebugViewMode('explain');

    try {
      const res = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, errorContext: error }),
      });
      const data = await res.json();
      setDebugResult(data.debug);
    } catch (err: any) {
      console.error('Debug failed', err);
    } finally {
      setIsDebugging(false);
    }
  };

  // 4. PROGRESSIVE HINTS
  const handleGetHint = async (step = currentHintStep) => {
    setIsHintLoading(true);
    setActiveTab('hint');

    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, step }),
      });
      const data = await res.json();
      setHintData(data.hint);
      setCurrentHintStep(step);
    } catch (err) {
      console.error('Hint error', err);
    } finally {
      setIsHintLoading(false);
    }
  };

  // 5. VISUALIZER
  const handleVisualize = async () => {
    if (!code.trim()) return;
    setIsVisualizing(true);
    setActiveTab('visualize');

    try {
      const res = await fetch('/api/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setVisSteps(data.steps || []);
      setCurrentStepIndex(0);
    } catch (err) {
      console.error('Visualize error', err);
    } finally {
      setIsVisualizing(false);
    }
  };

  const handleApplyFixedCode = (fixedCode: string) => {
    setCode(fixedCode);
    setActiveTab('output');
    setOutput('Applied corrected code to editor. Click "Run Code" (▶) to test.');
  };

  const activeVisStep = visSteps[currentStepIndex];

  return (
    <AppLayout>
      <div className="space-y-4 font-mono">
        {/* Workspace Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-950/90 border border-sky-800/40 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-sky-200 terminal-prompt flex items-center gap-1.5">
              <span className="text-cyan-400">~/workspace/</span>{language}
            </span>
            <span className="text-xs text-sky-600 hidden sm:inline">
              [IDE Mode: Student Interactive]
            </span>
          </div>

          {/* Quick Tab Selector */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs bg-slate-900/90 p-1.5 rounded-xl border border-sky-900/40">
            <button
              onClick={() => setActiveTab('explain')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'explain'
                  ? 'bg-sky-500/25 text-sky-200 border border-sky-400/50 font-bold shadow-md shadow-sky-950'
                  : 'text-sky-400 hover:text-sky-200'
              }`}
            >
              🧠 Explain
            </button>
            <button
              onClick={() => setActiveTab('debug')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'debug'
                  ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50 font-bold shadow-md shadow-amber-950'
                  : 'text-sky-400 hover:text-amber-300'
              }`}
            >
              🐞 Debug
            </button>
            <button
              onClick={() => setActiveTab('hint')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'hint'
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-bold shadow-md shadow-cyan-950'
                  : 'text-sky-400 hover:text-cyan-300'
              }`}
            >
              💡 Hints
            </button>
            <button
              onClick={() => setActiveTab('visualize')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'visualize'
                  ? 'bg-indigo-500/25 text-indigo-200 border border-indigo-400/50 font-bold shadow-md shadow-indigo-950'
                  : 'text-sky-400 hover:text-indigo-300'
              }`}
            >
              🔍 Visualize
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'output'
                  ? 'bg-blue-600/30 text-blue-200 border border-blue-400/50 font-bold shadow-md shadow-blue-950'
                  : 'text-sky-400 hover:text-blue-200'
              }`}
            >
              ▶ Output
            </button>
          </div>
        </div>

        {/* MAIN SPLIT WORKSPACE: LEFT (EDITOR) | RIGHT (AI TABS & OUTPUT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* LEFT SIDE: Code Editor (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              onRun={handleRunCode}
              onExplain={() => handleExplainCode()}
              onDebug={handleDebugCode}
              onHint={() => handleGetHint(1)}
              onReset={() => setCode(INITIAL_CODE[language])}
              onClear={() => setCode('')}
              activeLine={activeTab === 'visualize' && activeVisStep ? activeVisStep.lineNumber : null}
              isRunning={isRunning}
              isExplaining={isExplaining}
              isDebugging={isDebugging}
              isHintLoading={isHintLoading}
              minHeight="380px"
            />

            {/* Bottom Output Terminal */}
            <OutputTerminal
              output={output}
              error={error}
              isLoading={isRunning}
              executionTimeMs={executionTime}
              exitCode={exitCode}
              onClear={() => {
                setOutput('');
                setError('');
              }}
            />
          </div>

          {/* RIGHT SIDE: AI Assistant & Tabs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* 1. EXPLAIN TAB */}
            {activeTab === 'explain' && (
              <div className="terminal-card p-5 rounded-2xl border border-sky-800/40 bg-slate-950/95 space-y-3.5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-sky-900/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🧠</span>
                    <h3 className="text-sm font-bold text-sky-200">AI CODE EXPLAINER</h3>
                  </div>

                  {/* Difficulty Selector */}
                  <div className="flex items-center gap-1 text-[11px] bg-slate-900/80 p-1 rounded-lg border border-sky-900/40">
                    {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => {
                          setDifficultyLevel(lvl);
                          handleExplainCode(lvl);
                        }}
                        className={`px-2.5 py-0.5 rounded capitalize ${
                          difficultyLevel === lvl
                            ? 'bg-sky-500/25 text-sky-200 border border-sky-400/40 font-bold'
                            : 'text-sky-600 hover:text-sky-300'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {isExplaining ? (
                  <div className="py-14 text-center space-y-3">
                    <div className="inline-block w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-sky-500 terminal-cursor">
                      Generating student-friendly explanation ({difficultyLevel} mode)...
                    </p>
                  </div>
                ) : explanation ? (
                  <div className="text-xs text-sky-200 whitespace-pre-wrap leading-relaxed max-h-[550px] overflow-y-auto terminal-scrollbar pr-1">
                    {explanation}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3 text-sky-600 text-xs">
                    <p>Click &quot;Explain Code&quot; to receive a crystal-clear line-by-line breakdown.</p>
                    <button
                      onClick={() => handleExplainCode()}
                      className="terminal-button text-xs py-2 px-5 font-bold bg-sky-500/25 text-sky-100 border-sky-400/50 shadow-md"
                    >
                      🧠 Explain Code Now
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. DEBUG TAB */}
            {activeTab === 'debug' && (
              <div className="terminal-card p-5 rounded-2xl border border-amber-800/40 bg-slate-950/95 space-y-3.5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-amber-800/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🐞</span>
                    <h3 className="text-sm font-bold text-amber-300">AI CODE DEBUGGER</h3>
                  </div>

                  {debugResult && (
                    <div className="flex items-center gap-1 text-[11px] bg-slate-900/80 p-1 rounded-lg border border-amber-900/40">
                      <button
                        onClick={() => setDebugViewMode('explain')}
                        className={`px-2.5 py-0.5 rounded ${
                          debugViewMode === 'explain'
                            ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold'
                            : 'text-amber-600 hover:text-amber-300'
                        }`}
                      >
                        Explain
                      </button>
                      <button
                        onClick={() => setDebugViewMode('hint')}
                        className={`px-2.5 py-0.5 rounded ${
                          debugViewMode === 'hint'
                            ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold'
                            : 'text-amber-600 hover:text-amber-300'
                        }`}
                      >
                        Hint
                      </button>
                      <button
                        onClick={() => setDebugViewMode('fix')}
                        className={`px-2.5 py-0.5 rounded ${
                          debugViewMode === 'fix'
                            ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold'
                            : 'text-amber-600 hover:text-amber-300'
                        }`}
                      >
                        Fix
                      </button>
                    </div>
                  )}
                </div>

                {isDebugging ? (
                  <div className="py-14 text-center space-y-3">
                    <div className="inline-block w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-amber-400 terminal-cursor">
                      Diagnosing errors & logical anomalies...
                    </p>
                  </div>
                ) : debugResult ? (
                  <div className="space-y-3 text-xs leading-relaxed max-h-[550px] overflow-y-auto terminal-scrollbar pr-1">
                    {debugViewMode === 'explain' && (
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50">
                          <span className="text-[10px] uppercase font-bold text-rose-400">ERROR TYPE</span>
                          <div className="text-sm font-bold text-rose-200 mt-0.5">{debugResult.errorType}</div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-amber-400">WHAT HAPPENED</span>
                          <p className="text-sky-200">{debugResult.whatHappened}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-amber-400">WHY IT HAPPENED</span>
                          <p className="text-sky-300">{debugResult.whyItHappened}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-amber-400">PROBLEMATIC LINE</span>
                          <pre className="p-2.5 rounded-lg bg-slate-900 border border-rose-900/50 text-rose-300 overflow-x-auto">
                            {debugResult.problematicLine}
                          </pre>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-cyan-400">SUGGESTED FIX</span>
                          <p className="text-sky-200">{debugResult.suggestedFix}</p>
                        </div>
                      </div>
                    )}

                    {debugViewMode === 'hint' && (
                      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 space-y-2">
                        <h4 className="text-xs font-bold text-amber-300">💡 Debugging Hint</h4>
                        <p className="text-xs text-sky-200">{debugResult.suggestedFix}</p>
                        <p className="text-[11px] text-sky-500 italic">
                          Try adjusting the variables before looking directly at the complete fix!
                        </p>
                      </div>
                    )}

                    {debugViewMode === 'fix' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-cyan-400">CORRECTED CODE</span>
                          <button
                            onClick={() => handleApplyFixedCode(debugResult.correctedCode)}
                            className="terminal-button text-xs py-1 px-3 bg-sky-500/30 text-sky-100 font-bold border-sky-400 shadow-md"
                          >
                            Apply to Editor ❯
                          </button>
                        </div>
                        <pre className="p-3.5 rounded-xl bg-slate-900 border border-sky-800/40 text-sky-200 overflow-x-auto">
                          {debugResult.correctedCode}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3 text-sky-600 text-xs">
                    <p>Encountering a bug or unexpected output? Let the AI Debugger pinpoint the root cause.</p>
                    <button
                      onClick={handleDebugCode}
                      className="terminal-button text-xs py-2 px-5 font-bold bg-amber-950/40 text-amber-200 border-amber-800/50 shadow-md"
                    >
                      🐞 Debug My Code
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. PROGRESSIVE HINTS TAB */}
            {activeTab === 'hint' && (
              <div className="terminal-card p-5 rounded-2xl border border-cyan-800/40 bg-slate-950/95 space-y-3.5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-cyan-800/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💡</span>
                    <h3 className="text-sm font-bold text-cyan-300">PROGRESSIVE HINTS</h3>
                  </div>

                  {/* Step indicators */}
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {[1, 2, 3, 4].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleGetHint(s)}
                        className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center font-bold transition-all ${
                          currentHintStep === s
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40'
                            : currentHintStep > s
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                            : 'bg-slate-900 text-slate-600'
                        }`}
                      >
                        {s === 4 ? '★' : s}
                      </button>
                    ))}
                  </div>
                </div>

                {isHintLoading ? (
                  <div className="py-14 text-center space-y-3">
                    <div className="inline-block w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-cyan-400 terminal-cursor">
                      Formulating educational hint {currentHintStep}...
                    </p>
                  </div>
                ) : hintData ? (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 shadow-inner">
                      <div className="text-[11px] font-bold text-cyan-300 mb-1">
                        {hintData.title}
                      </div>
                      <p className="text-xs text-sky-200 leading-relaxed">{hintData.hintText}</p>
                    </div>

                    {hintData.isSolution && hintData.solutionCode && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-cyan-300 font-bold">
                          <span>SOLUTION CODE</span>
                          <button
                            onClick={() => handleApplyFixedCode(hintData.solutionCode)}
                            className="text-cyan-400 hover:text-cyan-200 underline"
                          >
                            Load into Editor
                          </button>
                        </div>
                        <pre className="p-3.5 rounded-xl bg-slate-900 border border-cyan-800 text-sky-200 overflow-x-auto">
                          {hintData.solutionCode}
                        </pre>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <button
                        disabled={currentHintStep <= 1}
                        onClick={() => handleGetHint(currentHintStep - 1)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-200 disabled:opacity-30"
                      >
                        ◀ Previous Hint
                      </button>

                      {currentHintStep < 3 && (
                        <button
                          onClick={() => handleGetHint(currentHintStep + 1)}
                          className="terminal-button text-xs py-1.5 px-3.5 bg-cyan-950/60 text-cyan-200 font-bold border-cyan-700/50"
                        >
                          Next Hint (Step {currentHintStep + 1}) ❯
                        </button>
                      )}

                      {currentHintStep === 3 && (
                        <button
                          onClick={() => handleGetHint(4)}
                          className="terminal-button text-xs py-1.5 px-3.5 bg-amber-950/60 text-amber-200 font-bold border-amber-700/50 shadow-md"
                        >
                          Reveal Solution ★
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3 text-sky-600 text-xs">
                    <p>Need a gentle nudge in the right direction without spoiling the answer?</p>
                    <button
                      onClick={() => handleGetHint(1)}
                      className="terminal-button text-xs py-2 px-5 font-bold bg-cyan-950/40 text-cyan-200 border-cyan-800/50 shadow-md"
                    >
                      💡 Get Hint 1 of 3
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 4. VISUALIZE TAB */}
            {activeTab === 'visualize' && (
              <div className="terminal-card p-5 rounded-2xl border border-indigo-800/40 bg-slate-950/95 space-y-3.5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-indigo-800/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔍</span>
                    <h3 className="text-sm font-bold text-indigo-300">EXECUTION TRACER</h3>
                  </div>

                  {visSteps.length > 0 && (
                    <span className="text-[11px] text-indigo-300 font-bold px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800">
                      Step {currentStepIndex + 1} / {visSteps.length}
                    </span>
                  )}
                </div>

                {isVisualizing ? (
                  <div className="py-14 text-center space-y-3">
                    <div className="inline-block w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-indigo-400 terminal-cursor">
                      Generating step-by-step execution trace...
                    </p>
                  </div>
                ) : visSteps.length > 0 && activeVisStep ? (
                  <div className="space-y-3 text-xs">
                    {/* Step Card */}
                    <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/50 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-indigo-400 font-bold">Line {activeVisStep.lineNumber}</span>
                        <code className="text-cyan-300 bg-slate-900 px-2 py-0.5 rounded-md border border-indigo-900">
                          {activeVisStep.codeSnippet}
                        </code>
                      </div>
                      <p className="text-xs text-sky-200">{activeVisStep.explanation}</p>
                    </div>

                    {/* Variable Inspector Table */}
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-sky-900/40 space-y-2">
                      <div className="text-[10px] text-sky-500 font-bold uppercase tracking-wider">
                        VARIABLES IN MEMORY
                      </div>
                      {Object.keys(activeVisStep.variables).length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(activeVisStep.variables).map(([name, val]) => (
                            <div key={name} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-sky-900/50">
                              <span className="text-sky-300 font-bold">{name}</span>
                              <span className="text-cyan-400 font-bold">{String(val)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[11px] text-sky-700 italic">No active variables</div>
                      )}
                    </div>

                    {/* Step Navigation Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        disabled={currentStepIndex === 0}
                        onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                        className="terminal-button text-xs py-1.5 px-3.5 disabled:opacity-40"
                      >
                        ◀ Previous
                      </button>

                      <button
                        onClick={() => setCurrentStepIndex(0)}
                        className="text-[11px] text-sky-600 hover:text-sky-300"
                      >
                        Reset
                      </button>

                      <button
                        disabled={currentStepIndex >= visSteps.length - 1}
                        onClick={() => setCurrentStepIndex((prev) => Math.min(visSteps.length - 1, prev + 1))}
                        className="terminal-button text-xs py-1.5 px-3.5 bg-indigo-950/60 text-indigo-200 border-indigo-800 font-bold disabled:opacity-40"
                      >
                        Next ❯
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3 text-sky-600 text-xs">
                    <p>Visualize how variables change step-by-step through execution.</p>
                    <button
                      onClick={handleVisualize}
                      className="terminal-button text-xs py-2 px-5 font-bold bg-indigo-950/40 text-indigo-200 border-indigo-800/50 shadow-md"
                    >
                      🔍 Visualize Code Flow
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 5. OUTPUT TAB (Quick Summary) */}
            {activeTab === 'output' && (
              <div className="terminal-card p-5 rounded-2xl border border-sky-800/40 bg-slate-950/95 space-y-3.5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-sky-900/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">▶</span>
                    <h3 className="text-sm font-bold text-sky-200">EXECUTION SUMMARY</h3>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-bold px-2 py-0.5 rounded bg-slate-900 border border-sky-800">{language.toUpperCase()}</span>
                </div>

                <div className="text-xs space-y-2.5">
                  <div className="flex justify-between py-1.5 border-b border-sky-900/20">
                    <span className="text-sky-500">Status:</span>
                    <span className={error ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold'}>
                      {error ? 'Failed' : 'Success (0)'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-sky-900/20">
                    <span className="text-sky-500">Runtime:</span>
                    <span className="text-sky-200">{executionTime} ms</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-sky-900/20">
                    <span className="text-sky-500">Environment:</span>
                    <span className="text-sky-200">Sandbox Client/Server</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="terminal-button w-full text-xs py-2.5 bg-sky-500/30 text-sky-100 font-bold border-sky-400 shadow-md"
                  >
                    {isRunning ? 'Running...' : '▶ Re-run Code'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-sky-400 p-8 flex items-center justify-center font-mono">Loading Workspace...</div>}>
      <WorkspaceContent />
    </Suspense>
  );
}
