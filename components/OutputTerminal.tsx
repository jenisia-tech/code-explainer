'use client';

import { useState } from 'react';

interface OutputTerminalProps {
  output: string;
  error?: string;
  isLoading?: boolean;
  executionTimeMs?: number;
  exitCode?: number;
  onClear?: () => void;
  title?: string;
}

export default function OutputTerminal({
  output,
  error,
  isLoading = false,
  executionTimeMs,
  exitCode = 0,
  onClear,
  title = '~/output/stdout.log',
}: OutputTerminalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = error ? `${output}\n\n[ERROR]\n${error}` : output;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="terminal-card flex flex-col border border-sky-800/40 rounded-2xl overflow-hidden bg-slate-950/95 shadow-2xl shadow-black/80">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-sky-900/30 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isLoading
                ? 'bg-amber-400 animate-pulse shadow-sm shadow-amber-400'
                : error
                ? 'bg-rose-500 shadow-sm shadow-rose-500'
                : 'bg-cyan-400 shadow-sm shadow-cyan-400'
            }`}
          />
          <span className="text-sky-300 font-bold">{title}</span>
          {executionTimeMs !== undefined && (
            <span className="text-[11px] text-sky-600">({executionTimeMs}ms)</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {output && (
            <button
              onClick={handleCopy}
              className="text-[11px] text-sky-400 hover:text-sky-200 border border-sky-800/40 px-2.5 py-0.5 rounded-lg bg-slate-900/70 hover:bg-sky-950 transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          )}
          {onClear && (
            <button
              onClick={onClear}
              className="text-[11px] text-sky-600 hover:text-rose-400 border border-sky-800/40 px-2.5 py-0.5 rounded-lg bg-slate-900/70 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Output Stream Body */}
      <div className="p-4 font-mono text-xs overflow-y-auto max-h-[300px] min-h-[120px] bg-slate-950 leading-relaxed terminal-scrollbar">
        {isLoading ? (
          <div className="flex items-center gap-2.5 text-cyan-400 animate-pulse py-4">
            <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Executing program in sandbox environment...</span>
          </div>
        ) : error ? (
          <div className="space-y-2">
            {output && <pre className="text-sky-300 whitespace-pre-wrap">{output}</pre>}
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-200 shadow-inner">
              <div className="font-bold text-rose-300 flex items-center gap-1.5 mb-1">
                <span>❯</span>
                <span>EXECUTION ERROR (Exit code: {exitCode})</span>
              </div>
              <pre className="whitespace-pre-wrap text-xs font-mono text-rose-200">{error}</pre>
            </div>
          </div>
        ) : output ? (
          <pre className="text-sky-200 whitespace-pre-wrap">{output}</pre>
        ) : (
          <div className="text-sky-800 text-xs italic py-4">
            $ Output stream ready. Press &quot;Run Code&quot; (▶) to execute.
          </div>
        )}
      </div>

      {/* Status Line */}
      <div className="px-4 py-1.5 bg-slate-900/50 border-t border-sky-900/20 text-[10px] font-mono text-sky-600 flex justify-between">
        <span>Exit code: {exitCode}</span>
        <span>Terminal STDOUT / STDERR</span>
      </div>
    </div>
  );
}
