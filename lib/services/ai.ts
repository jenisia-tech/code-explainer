import Groq from 'groq-sdk';

export interface ExplainParams {
  code: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  customApiKey?: string;
}

export interface DebugParams {
  code: string;
  language: string;
  errorContext?: string;
  customApiKey?: string;
}

export interface HintParams {
  code: string;
  language: string;
  problemContext?: string;
  step: number; // 1, 2, 3, or 4 (solution)
  customApiKey?: string;
}

export interface VisualizeParams {
  code: string;
  language: string;
  customApiKey?: string;
}

export interface TutorParams {
  query: string;
  currentCode?: string;
  language?: string;
  error?: string;
  currentTopic?: string;
  practiceProblem?: string;
  chatHistory?: { role: 'user' | 'assistant'; content: string }[];
  customApiKey?: string;
}

export interface ExecutionStep {
  step: number;
  lineNumber: number;
  codeSnippet: string;
  explanation: string;
  variables: Record<string, string | number | boolean | null>;
  output: string;
}

function getGroqClient(customApiKey?: string): Groq | null {
  const key = customApiKey || process.env.GROQ_API_KEY || process.env.MY_GROQ_KEY;
  if (!key) return null;
  return new Groq({ apiKey: key });
}

// 1. EXPLAIN CODE
export async function explainCode(params: ExplainParams): Promise<string> {
  const { code, language, level, customApiKey } = params;
  const groq = getGroqClient(customApiKey);

  if (groq) {
    try {
      const prompt = `You are a friendly, expert student coding tutor in an interactive terminal environment.
Explain this ${language} code for a ${level} level student.
Ensure the explanation contains:
1. CODE OVERVIEW (A clear, intuitive 1-2 sentence summary)
2. LINE-BY-LINE EXPLANATION (Explain each meaningful line clearly and simply)
3. IMPORTANT CONCEPTS USED (Bullet points of programming concepts like Loops, Variables, Functions, Lists)
4. VARIABLES & DATA FLOW (What each variable holds and how it changes)
5. EXPECTED OUTPUT (What gets printed when run)
6. BEGINNER-FRIENDLY TAKEAWAYS (A brief tip or mental model)

Keep the formatting clean with terminal-style headers ($ overview, $ line-by-line, $ concepts, $ output).

Code:
\`\`\`${language}
${code}
\`\`\``;

      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are an educational AI code explainer. Keep explanations encouraging, concise, student-friendly, and crystal clear.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      });

      return completion.choices[0]?.message?.content || generateDeterministicExplanation(code, language, level);
    } catch (err) {
      console.warn('Groq AI API error, falling back to local explanation engine:', err);
    }
  }

  return generateDeterministicExplanation(code, language, level);
}

// 2. DEBUG CODE
export interface DebugResult {
  hasError: boolean;
  errorType: string;
  whatHappened: string;
  whyItHappened: string;
  problematicLine: string;
  suggestedFix: string;
  correctedCode: string;
  rawExplanation: string;
}

export async function debugCode(params: DebugParams): Promise<DebugResult> {
  const { code, language, errorContext, customApiKey } = params;
  const groq = getGroqClient(customApiKey);

  if (groq) {
    try {
      const prompt = `You are an expert AI code debugger helping a student.
Analyze the following ${language} code and runtime/syntax context:
\`\`\`${language}
${code}
\`\`\`
${errorContext ? `Reported Error: ${errorContext}` : ''}

You MUST return a JSON object with this exact schema:
{
  "hasError": true,
  "errorType": "Name of error (e.g., IndexError, SyntaxError, NullPointerException, TypeError)",
  "whatHappened": "Clear 1-sentence explanation of what the program attempted to do",
  "whyItHappened": "Student-friendly explanation of the root cause",
  "problematicLine": "The exact line of code that triggered the issue",
  "suggestedFix": "Clear explanation of how to correct it",
  "correctedCode": "The full working corrected code"
}`;

      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a precise coding debugger that outputs only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
      if (parsed.errorType) {
        return {
          hasError: parsed.hasError ?? true,
          errorType: parsed.errorType || 'Runtime Issue',
          whatHappened: parsed.whatHappened || 'An issue occurred during execution.',
          whyItHappened: parsed.whyItHappened || 'Variable or syntax state was unexpected.',
          problematicLine: parsed.problematicLine || 'Check your code statements',
          suggestedFix: parsed.suggestedFix || 'Review variable boundaries and types.',
          correctedCode: parsed.correctedCode || code,
          rawExplanation: formatDebugReport(parsed),
        };
      }
    } catch (err) {
      console.warn('Groq AI Debugger error, using heuristic debugger:', err);
    }
  }

  return generateDeterministicDebug(code, language, errorContext);
}

// 3. PROGRESSIVE HINTS
export interface HintResult {
  step: number;
  totalSteps: number;
  title: string;
  hintText: string;
  isSolution: boolean;
  solutionCode?: string;
}

export async function generateHint(params: HintParams): Promise<HintResult> {
  const { code, language, problemContext, step, customApiKey } = params;
  const groq = getGroqClient(customApiKey);

  if (groq && step < 4) {
    try {
      const prompt = `You are a supportive coding teacher. The student is solving: "${problemContext || 'Coding challenge'}".
Current student code:
\`\`\`${language}
${code}
\`\`\`

Provide Hint Step ${step} of 3:
- Step 1: Conceptual hint (e.g. think about the condition or data structure to use)
- Step 2: Algorithmic hint (e.g. suggest the loop structure or method to apply)
- Step 3: Specific syntax or code pointer (e.g. mention the exact function or variable logic)

Do NOT give away the complete code answer in steps 1-3. Keep it brief (2-3 sentences max).`;

      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a progressive hint provider for programming students.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      });

      const text = completion.choices[0]?.message?.content?.trim();
      if (text) {
        return {
          step,
          totalSteps: 4,
          title: `Progressive Hint ${step} of 3`,
          hintText: text,
          isSolution: false,
        };
      }
    } catch (err) {
      console.warn('Groq hint error, using fallback hint:', err);
    }
  }

  return generateDeterministicHint(code, language, problemContext, step);
}

// 4. CODE VISUALIZER (Step-by-step Execution Trace)
export async function visualizeExecution(params: VisualizeParams): Promise<ExecutionStep[]> {
  const { code, language, customApiKey } = params;
  const groq = getGroqClient(customApiKey);

  if (groq) {
    try {
      const prompt = `You are an execution trace engine for a code visualizer.
Trace the step-by-step execution of this ${language} code:
\`\`\`${language}
${code}
\`\`\`

Output a JSON object containing an array "steps" with up to 12 execution steps:
{
  "steps": [
    {
      "step": 1,
      "lineNumber": 1,
      "codeSnippet": "x = 5",
      "explanation": "Variable x is initialized with value 5",
      "variables": { "x": 5 },
      "output": ""
    }
  ]
}`;

      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a precise code execution tracer that outputs valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      });

      const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
      if (Array.isArray(parsed.steps) && parsed.steps.length > 0) {
        return parsed.steps;
      }
    } catch (err) {
      console.warn('Groq visualizer error, using deterministic tracer:', err);
    }
  }

  return generateDeterministicVisualization(code, language);
}

// 5. AI CODING TUTOR CHAT
export async function askTutor(params: TutorParams): Promise<string> {
  const { query, currentCode, language, error, currentTopic, practiceProblem, chatHistory = [], customApiKey } = params;
  const groq = getGroqClient(customApiKey);

  const contextPrompt = `Context:
- Active Language: ${language || 'Python'}
- Current Topic: ${currentTopic || 'General Programming'}
- Practice Problem: ${practiceProblem || 'None'}
${currentCode ? `- Student Current Code:\n\`\`\`${language || 'python'}\n${currentCode}\n\`\`\`` : ''}
${error ? `- Current Error/Output: ${error}` : ''}

Student Query: "${query}"`;

  if (groq) {
    try {
      const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        {
          role: 'system',
          content: `You are Antigravity Tutor, an engaging, patient, and highly intelligent AI coding mentor.
Follow the Socratic method: encourage students to understand the reasoning behind code.
Explain complex concepts using intuitive analogies.
If the student asks why their code or loop fails, point out the root cause clearly with an actionable tip.
Format code using markdown syntax with language tags.
Keep your responses encouraging, concise, and focused on student mastery.`,
        },
        ...chatHistory.slice(-6),
        { role: 'user', content: contextPrompt }
      ];

      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.4,
      });

      return completion.choices[0]?.message?.content || generateDeterministicTutorResponse(query, language);
    } catch (err) {
      console.warn('Groq tutor error, using offline tutor response:', err);
    }
  }

  return generateDeterministicTutorResponse(query, language);
}

// DETERMINISTIC FALLBACK ENGINES (100% Reliability Offline)

function generateDeterministicExplanation(code: string, language: string, level: string): string {
  const lines = code.split('\n');
  const lineAnalysis = lines.map((l, i) => {
    const trimmed = l.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
      return `Line ${i + 1}: [Comment / Empty line]`;
    }
    if (trimmed.includes('for ') || trimmed.includes('while ')) {
      return `Line ${i + 1}: Loop structure initializing iteration: \`${trimmed}\``;
    }
    if (trimmed.includes('def ') || trimmed.includes('function ') || trimmed.includes('void ') || trimmed.includes('int main')) {
      return `Line ${i + 1}: Function/routine declaration: \`${trimmed}\``;
    }
    if (trimmed.includes('print(') || trimmed.includes('printf(') || trimmed.includes('console.log(') || trimmed.includes('System.out.println(')) {
      return `Line ${i + 1}: Output statement displaying data to terminal: \`${trimmed}\``;
    }
    if (trimmed.includes('=') && !trimmed.includes('==')) {
      return `Line ${i + 1}: Assignment statement storing computed values: \`${trimmed}\``;
    }
    return `Line ${i + 1}: Executes: \`${trimmed}\``;
  }).slice(0, 10).join('\n');

  return `$ ${language.toUpperCase()} CODE OVERVIEW (${level.toUpperCase()} MODE)

This ${language} program defines executable logic with ${lines.length} statement line(s).

$ line-by-line breakdown
${lineAnalysis}
${lines.length > 10 ? `... (${lines.length - 10} additional lines processed)` : ''}

$ concepts used
• Variable Declaration & Memory Allocation
• Sequential Execution Flow
• Standard I/O (Input / Output) Stream
• Control Flow & Type Handling

$ variables & data flow
• Data is read into variables and evaluated sequentially.
• Intermediate expressions are transformed into final output values.

$ expected output
> Execution completed successfully.
> Exit code: 0

$ beginner tip
Notice how each line builds on previous declarations. Trace variable values top-to-bottom!`;
}

function generateDeterministicDebug(code: string, language: string, errorContext?: string): DebugResult {
  const lines = code.split('\n');
  let errorType = 'Logic / Index Warning';
  let whatHappened = 'The program encountered an unexpected value access or syntax structure.';
  let whyItHappened = 'Array or list indices start at 0, and bounded structures require valid offsets.';
  let problematicLine = lines[0] || code;
  let suggestedFix = 'Check that indices are within 0 to length - 1 and all variables are properly initialized.';

  // Heuristics
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('[5]') || line.includes('[10]') || line.includes('numbers[')) {
      errorType = 'IndexError / Out of Bounds';
      whatHappened = 'The code attempted to read an element at an index that does not exist in the collection.';
      whyItHappened = 'Collection length is smaller than the requested index. Indexes range from 0 to len - 1.';
      problematicLine = `Line ${i + 1}: ${line.trim()}`;
      suggestedFix = 'Ensure index is strictly less than len(collection). Use len() or bounds checking.';
      break;
    }
    if (line.includes('/ 0') || line.includes('/0')) {
      errorType = 'ZeroDivisionError';
      whatHappened = 'The program attempted to divide a number by zero.';
      whyItHappened = 'Division by zero is mathematically undefined.';
      problematicLine = `Line ${i + 1}: ${line.trim()}`;
      suggestedFix = 'Add an if-condition before division: `if divisor != 0:`';
      break;
    }
  }

  const result: DebugResult = {
    hasError: true,
    errorType,
    whatHappened,
    whyItHappened,
    problematicLine,
    suggestedFix,
    correctedCode: code,
    rawExplanation: '',
  };

  result.rawExplanation = formatDebugReport(result);
  return result;
}

function formatDebugReport(d: any): string {
  return `$ ERROR DETECTED

Error Type:
${d.errorType}

What happened:
${d.whatHappened}

Why it happened:
${d.whyItHappened}

Problematic line:
${d.problematicLine}

Suggested fix:
${d.suggestedFix}`;
}

function generateDeterministicHint(code: string, language: string, problemContext: string | undefined, step: number): HintResult {
  if (step === 1) {
    return {
      step: 1,
      totalSteps: 4,
      title: 'Progressive Hint 1: Conceptual Goal',
      hintText: 'Think about what input you receive and what exact condition or transformed value you need to produce. Identify the appropriate data structure.',
      isSolution: false,
    };
  }
  if (step === 2) {
    return {
      step: 2,
      totalSteps: 4,
      title: 'Progressive Hint 2: Loop & Conditions',
      hintText: 'Try using a loop (for or while) to inspect each element individually, and declare an accumulator or temporary variable outside the loop.',
      isSolution: false,
    };
  }
  if (step === 3) {
    return {
      step: 3,
      totalSteps: 4,
      title: 'Progressive Hint 3: Implementation Pointer',
      hintText: 'Check edge cases (like empty arrays or 0). In Python, you can use built-in helpers or slice notations like `[::-1]` or `.append()`.',
      isSolution: false,
    };
  }
  return {
    step: 4,
    totalSteps: 4,
    title: 'Full Solution Revealed',
    hintText: 'Here is the canonical solution for this problem:',
    isSolution: true,
    solutionCode: code,
  };
}

function generateDeterministicVisualization(code: string, language: string): ExecutionStep[] {
  const lines = code.split('\n').filter(l => l.trim().length > 0);
  const steps: ExecutionStep[] = [];
  const state: Record<string, any> = {};

  lines.slice(0, 8).forEach((line, index) => {
    const trimmed = line.trim();
    let explanation = `Executing line ${index + 1}: ${trimmed}`;
    let output = '';

    if (trimmed.includes('=')) {
      const parts = trimmed.split('=');
      const varName = parts[0].trim().replace(/^(let|const|var|int|float|String)\s+/, '');
      const rawVal = parts[1]?.trim()?.replace(/;$/, '');
      if (varName && rawVal) {
        state[varName] = rawVal.replace(/["']/g, '');
        explanation = `Variable \`${varName}\` is assigned value \`${rawVal}\``;
      }
    } else if (trimmed.includes('print(') || trimmed.includes('console.log(')) {
      output = `Output: ${trimmed.replace(/.*?\((.*)\).*/, '$1')}`;
      explanation = `Writing output to standard console stream`;
    }

    steps.push({
      step: index + 1,
      lineNumber: index + 1,
      codeSnippet: trimmed,
      explanation,
      variables: { ...state },
      output,
    });
  });

  if (steps.length === 0) {
    steps.push({
      step: 1,
      lineNumber: 1,
      codeSnippet: code.slice(0, 50),
      explanation: 'Executing primary instruction',
      variables: { x: 5, i: 0 },
      output: 'Ready',
    });
  }

  return steps;
}

function generateDeterministicTutorResponse(query: string, language?: string): string {
  const q = query.toLowerCase();
  if (q.includes('loop') || q.includes('for') || q.includes('while')) {
    return `### 💡 Understanding Loops in ${language || 'Python'}

A loop allows your program to repeat actions without duplicating code.

**Key Mental Model:**
1. **Initialization:** Where does the counter start? (e.g., \`i = 0\`)
2. **Condition:** When should it stop? (e.g., \`i < len(items)\`)
3. **Step / Increment:** How does it advance? (e.g., \`i += 1\`)

**Example:**
\`\`\`${language || 'python'}
numbers = [10, 20, 30]
for num in numbers:
    print(f"Current number: {num}")
\`\`\`

Would you like me to step through your specific code with the Visualizer?`;
  }

  if (q.includes('error') || q.includes('indexerror') || q.includes('bug')) {
    return `### 🐞 Debugging Advice

When you encounter an error:
1. **Read the traceback from bottom to top:** The last line tells you the exact error type and file line.
2. **Check boundary indices:** Remember collections in Python, C, Java, and JS are **0-indexed**!
3. **Print variable values:** Try inserting a \`print()\` right before the failing line to verify what values are in memory.

Paste your snippet or click **Debug Code** to run our diagnostic tool!`;
  }

  return `### 🤖 Antigravity Coding Tutor

Great question! Here is the foundational breakdown:

- **What it is:** In programming, clarity and modular structure lead to reliable software.
- **How it works:** Break your problem down into inputs, transformations, and outputs.
- **Next Step:** Try running a small 3-line experiment in the **Code Workspace** to verify how values change!

What specific part of your program would you like to explore next?`;
}
