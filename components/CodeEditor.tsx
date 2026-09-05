'use client';

import { useRef } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: 'python' | 'javascript' | 'c' | 'java';
  onLanguageChange?: (lang: 'python' | 'javascript' | 'c' | 'java') => void;
  onRun?: () => void;
  onExplain?: () => void;
  onDebug?: () => void;
  onHint?: () => void;
  onReset?: () => void;
  onClear?: () => void;
  activeLine?: number | null;
  isRunning?: boolean;
  isExplaining?: boolean;
  isDebugging?: boolean;
  isHintLoading?: boolean;
  showToolbar?: boolean;
  minHeight?: string;
  readOnly?: boolean;
}

const DEFAULT_SNIPPETS: Record<string, string> = {
  python: `# Python Code Example
numbers = [1, 2, 3, 4, 5]

print("Iterating over numbers:")
for i in numbers:
    print(f"Item: {i}")

# Calculate sum
total = sum(numbers)
print(f"Sum = {total}")`,
  javascript: `// JavaScript Code Example
const numbers = [1, 2, 3, 4, 5];

console.log("Iterating over numbers:");
for (let i = 0; i < numbers.length; i++) {
    console.log(\`Item: \${numbers[i]}\`);
}

const total = numbers.reduce((a, b) => a + b, 0);
console.log(\`Sum = \${total}\`);`,
  c: `// C Code Example
#include <stdio.h>

int main() {
    int numbers[] = {1, 2, 3, 4, 5};
    int total = 0;

    printf("Iterating over numbers:\\n");
    for (int i = 0; i < 5; i++) {
        printf("Item: %d\\n", numbers[i]);
        total += numbers[i];
    }

    printf("Sum = %d\\n", total);
    return 0;
}`,
  java: `// Java Code Example
public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        int total = 0;

        System.out.println("Iterating over numbers:");
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("Item: " + numbers[i]);
            total += numbers[i];
        }

        System.out.println("Sum = " + total);
    }
}`
};

export default function CodeEditor({
  code,
  onChange,
  language,
  onLanguageChange,
  onRun,
  onExplain,
  onDebug,
  onHint,
  onReset,
  onClear,
  activeLine = null,
  isRunning = false,
  isExplaining = false,
  isDebugging = false,
  isHintLoading = false,
  showToolbar = true,
  minHeight = '320px',
  readOnly = false,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 1);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleLoadTemplate = () => {
    if (DEFAULT_SNIPPETS[language]) {
      onChange(DEFAULT_SNIPPETS[language]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      // Insert 4 spaces
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className="terminal-card flex flex-col border border-sky-800/40 rounded-2xl overflow-hidden bg-slate-950/95 shadow-2xl shadow-black/80">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-900/90 border-b border-sky-900/30 text-xs font-mono">
        {/* Left: Window dots & filename */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 shadow-sm shadow-rose-500/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 shadow-sm shadow-amber-500/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50" />
          <span className="text-sky-300 ml-1 font-bold">
            main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'c' ? 'c' : 'java'}
          </span>
          <span className="text-[10px] text-sky-600 hidden sm:inline">
            ({lineCount} lines, {code.length} bytes)
          </span>
        </div>

        {/* Right: Language Selector & Template */}
        <div className="flex items-center gap-2">
          {onLanguageChange && (
            <div className="flex items-center gap-1.5">
              <span className="text-sky-600 text-[11px]">$ lang:</span>
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as any)}
                className="bg-slate-950 border border-sky-700/50 rounded-lg px-2.5 py-1 text-xs text-sky-200 font-mono outline-none focus:border-sky-400 cursor-pointer shadow-inner"
              >
                <option value="python">Python (py)</option>
                <option value="javascript">JavaScript (js)</option>
                <option value="c">C (gcc)</option>
                <option value="java">Java (jdk)</option>
              </select>
            </div>
          )}

          <button
            onClick={handleLoadTemplate}
            title="Load sample template"
            className="text-[11px] text-sky-400 hover:text-sky-200 border border-sky-800/40 px-2.5 py-1 rounded-lg bg-slate-900/70 hover:bg-sky-950 transition-colors"
          >
            Template
          </button>
        </div>
      </div>

      {/* Editor Body: Line Numbers + Textarea */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-sm bg-slate-950" style={{ minHeight }}>
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          className="w-12 py-3 bg-slate-950 border-r border-sky-950 text-right pr-2.5 select-none text-sky-800 text-xs overflow-hidden shrink-0"
        >
          {Array.from({ length: lineCount }).map((_, index) => {
            const lineNum = index + 1;
            const isHighlighted = activeLine === lineNum;
            return (
              <div
                key={lineNum}
                className={`leading-6 h-6 transition-colors ${
                  isHighlighted ? 'text-cyan-300 font-bold bg-sky-500/25 rounded-l' : ''
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Active Line Highlight Background */}
        {activeLine && activeLine <= lineCount && (
          <div
            className="absolute left-12 right-0 bg-sky-500/15 border-y border-sky-400/30 pointer-events-none transition-all duration-200"
            style={{
              top: `${(activeLine - 1) * 24 + 12}px`,
              height: '24px',
            }}
          />
        )}

        {/* Editable Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          className="flex-1 w-full p-3.5 bg-transparent text-sky-200 font-mono text-sm leading-6 resize-none outline-none overflow-y-auto whitespace-pre tab-size-4 selection:bg-sky-600 selection:text-white"
          style={{ minHeight }}
          placeholder={`// Enter ${language} code here...`}
        />
      </div>

      {/* Optional Integrated Action Toolbar */}
      {showToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/90 border-t border-sky-900/30 text-xs font-mono">
          {/* Left Actions: Run, Explain, Debug, Hint */}
          <div className="flex flex-wrap items-center gap-2">
            {onRun && (
              <button
                onClick={onRun}
                disabled={isRunning || !code.trim()}
                className="terminal-button flex items-center gap-1.5 py-1.5 px-4 bg-sky-500/25 hover:bg-sky-500/40 text-sky-200 font-bold border-sky-400/50 shadow-md shadow-sky-950 disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <span className="w-3 h-3 border-2 border-sky-300 border-t-transparent rounded-full animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <span className="text-cyan-400">▶</span>
                    <span>Run Code</span>
                  </>
                )}
              </button>
            )}

            {onExplain && (
              <button
                onClick={onExplain}
                disabled={isExplaining || !code.trim()}
                className="terminal-button flex items-center gap-1.5 py-1.5 px-3.5 bg-blue-950/60 border-blue-700/50 text-blue-200 hover:text-blue-100 disabled:opacity-50"
              >
                {isExplaining ? (
                  <>
                    <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>🧠</span>
                    <span>Explain</span>
                  </>
                )}
              </button>
            )}

            {onDebug && (
              <button
                onClick={onDebug}
                disabled={isDebugging || !code.trim()}
                className="terminal-button flex items-center gap-1.5 py-1.5 px-3.5 bg-indigo-950/60 border-indigo-700/50 text-indigo-200 hover:text-indigo-100 disabled:opacity-50"
              >
                {isDebugging ? (
                  <>
                    <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span>Debugging...</span>
                  </>
                ) : (
                  <>
                    <span>🐞</span>
                    <span>Debug</span>
                  </>
                )}
              </button>
            )}

            {onHint && (
              <button
                onClick={onHint}
                disabled={isHintLoading}
                className="terminal-button flex items-center gap-1.5 py-1.5 px-3.5 bg-cyan-950/60 border-cyan-700/50 text-cyan-200 hover:text-cyan-100 disabled:opacity-50"
              >
                {isHintLoading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>Hinting...</span>
                  </>
                ) : (
                  <>
                    <span>💡</span>
                    <span>Get Hint</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Right Actions: Reset, Clear */}
          <div className="flex items-center gap-2">
            {onReset && (
              <button
                onClick={onReset}
                className="text-sky-600 hover:text-sky-300 px-2 py-1 text-[11px] transition-colors"
                title="Reset to default code"
              >
                ↺ Reset
              </button>
            )}
            {onClear && (
              <button
                onClick={onClear}
                disabled={!code}
                className="text-sky-700 hover:text-rose-400 px-2 py-1 text-[11px] transition-colors disabled:opacity-30"
                title="Clear editor"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
