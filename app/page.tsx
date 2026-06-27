"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("auto");
  const [detailLevel, setDetailLevel] = useState("detailed");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleExplainCode = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setExplanation("");

    try {
      // Simulated API call - replace with your actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Example response - replace with actual API integration
      const mockExplanation = `$ ${language !== 'auto' ? language : 'detected'} code analysis
    
> Function: calculateSum
> Purpose: Performs arithmetic addition of two numbers
> Parameters: 
  - a (number): First operand
  - b (number): Second operand
> Returns: number - The sum of a and b
> Complexity: O(1)

$ detailed breakdown
    
1. Function Declaration:
   The function is declared using arrow syntax, accepting two parameters.

2. Type Coercion:
   JavaScript automatically handles type coercion for the '+' operator.

3. Return Statement:
   Returns the computed sum immediately without side effects.

$ suggestions
    
• Consider adding input validation
• Add TypeScript types for better safety
• Document edge cases (overflow, NaN)

$ output
> Execution completed successfully
> Exit code: 0`;

      setExplanation(mockExplanation);
    } catch (error) {
      setExplanation("$ error: Failed to analyze code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setCode("");
    setExplanation("");
  };

  const handleSampleCode = () => {
    const samples: Record<string, string> = {
      javascript: `function calculateSum(a, b) {
  return a + b;
}

const result = calculateSum(5, 3);
console.log(result); // Output: 8`,
      python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`,
      typescript: `interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): Promise<User> {
  return fetch(\`/api/users/\${id}\`)
    .then(response => response.json());
}`,
    };
    
    setCode(samples[language] || samples.javascript);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCopyExplanation = async () => {
    if (!explanation) return;
    try {
      await navigator.clipboard.writeText(explanation);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 1800);
    } catch (err) {
      setCopyStatus('failed');
      setTimeout(() => setCopyStatus('idle'), 1800);
    }
  };

  // Show loading while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-green-600 terminal-cursor">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (middleware/redirect will handle it)
  if (!isAuthenticated) {
    return null;
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
              user@code-explainer:~$
            </span>
            <div className="ml-auto">
              <button
                onClick={handleLogout}
                className="text-xs text-green-600 hover:text-green-400 transition-colors"
              >
                $ logout
              </button>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-green-300 terminal-prompt">
            Code Explainer
          </h1>
          <p className="text-green-600 text-sm mb-1">
            [INFO] Paste your code below for instant analysis and explanation
          </p>
        </div>

        {/* Controls */}
        <div className="terminal-card mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-green-600 mb-1.5">
                $ language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="terminal-input w-full"
              >
                <option value="auto">auto-detect</option>
                <option value="javascript">javascript.js</option>
                <option value="python">python.py</option>
                <option value="typescript">typescript.ts</option>
                <option value="java">java.java</option>
                <option value="cpp">c++.cpp</option>
                <option value="rust">rust.rs</option>
                <option value="go">go.go</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-green-600 mb-1.5">
                $ detail-level
              </label>
              <select
                value={detailLevel}
                onChange={(e) => setDetailLevel(e.target.value)}
                className="terminal-input w-full"
              >
                <option value="brief">--brief</option>
                <option value="detailed">--detailed</option>
                <option value="comprehensive">--comprehensive</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSampleCode}
                className="terminal-button text-xs"
                title="Load sample code"
              >
                $ load-sample
              </button>
            </div>
          </div>
        </div>

        {/* Code Input */}
        <div className="terminal-card mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-green-500 font-semibold">
              ~/input/code.{language === "auto" ? "txt" : language.split(".").pop()}
            </label>
            <span className="text-xs text-green-700">
              {code.length} bytes
            </span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`// Enter your code here...\n// Example:\n\nfunction hello() {\n  console.log("Hello, World!");\n}`}
            className="terminal-textarea w-full min-h-[250px] md:min-h-[300px]"
            spellCheck={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleExplainCode}
            disabled={!code.trim() || isLoading}
            className="terminal-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></span>
                <span>$ analyzing...</span>
              </>
            ) : (
              <>
                <span className="text-green-500">❯</span>
                <span>$ explain-code</span>
              </>
            )}
          </button>
          <button
            onClick={handleClear}
            disabled={!code && !explanation}
            className="terminal-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-green-500">❯</span> $ clear
          </button>
        </div>

        {/* Output Terminal */}
        {(explanation || isLoading) && (
          <div className="terminal-card">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-800/30">
              <h2 className="text-sm font-semibold text-green-500">
                ~/output/explanation.log
              </h2>
              <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs text-green-600">
                    {isLoading ? "running..." : "completed"}
                  </span>
                  {!isLoading && explanation && (
                    <button
                      onClick={handleCopyExplanation}
                      className="terminal-button terminal-button-sm ml-2"
                      aria-label="Copy explanation"
                    >
                      {copyStatus === 'copied' ? 'copied' : 'copy'}
                    </button>
                  )}
                </div>
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-green-900/20 rounded w-3/4"></div>
                  <div className="h-4 bg-green-900/20 rounded w-1/2"></div>
                  <div className="h-4 bg-green-900/20 rounded w-5/6"></div>
                </div>
                <p className="text-green-600 text-sm terminal-cursor">
                  Processing code analysis
                </p>
              </div>
            ) : (
              <div className="terminal-output terminal-scrollbar max-h-[500px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {explanation}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Status Bar */}
        <div className="mt-8 pt-4 border-t border-green-800/30">
          <div className="flex flex-wrap justify-between text-xs text-green-700">
            <div className="flex gap-4">
              <span>[STATUS] Authenticated</span>
              <span>[MODE] {detailLevel}</span>
            </div>
            <div className="flex gap-4">
              <span>user@code-explainer</span>
              <span>Session: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}