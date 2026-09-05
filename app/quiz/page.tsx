'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { QUIZ_QUESTIONS, QuizQuestion } from '@/lib/data/quizzes';

type LanguageFilter = 'all' | 'python' | 'c' | 'java' | 'javascript';
type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

export default function QuizPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageFilter>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [totalAttempted, setTotalAttempted] = useState<number>(0);
  const [notification, setNotification] = useState<string>('');

  const filteredQuestions = QUIZ_QUESTIONS.filter((q) => {
    const langMatch = selectedLanguage === 'all' || q.language === selectedLanguage;
    const diffMatch = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return langMatch && diffMatch;
  });

  const activeQuestion: QuizQuestion | undefined = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || !activeQuestion || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    setTotalAttempted((prev) => prev + 1);

    const isCorrect = selectedOption === activeQuestion.correctIndex;
    if (isCorrect) {
      setUserScore((prev) => prev + 1);
      setNotification(`🎉 Correct! +${activeQuestion.xp} XP Earned!`);
      setTimeout(() => setNotification(''), 3000);

      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            xpEarned: activeQuestion.xp,
            quizResult: { isCorrect: true, xp: activeQuestion.xp },
            activityTitle: `Passed quiz on ${activeQuestion.topic} (${activeQuestion.language.toUpperCase()})`,
            activityType: 'quiz',
          }),
        });
      } catch (err) {
        console.error('Quiz progress update error', err);
      }
    } else {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            xpEarned: 0,
            quizResult: { isCorrect: false, xp: 0 },
            activityTitle: `Attempted quiz on ${activeQuestion.topic}`,
            activityType: 'quiz',
          }),
        });
      } catch (err) {
        console.error('Quiz progress update error', err);
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentQuestionIndex(0);
    }
  };

  const accuracyPercent = totalAttempted > 0 ? Math.round((userScore / totalAttempted) * 100) : 0;

  return (
    <AppLayout>
      <div className="space-y-6 font-mono">
        {/* Header & Filter Controls */}
        <div className="terminal-card p-5 rounded-xl border border-sky-800/40 bg-slate-950/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base text-cyan-400">🧪</span>
              <h1 className="text-xl font-bold text-sky-300 terminal-prompt">
                INTERACTIVE CODING QUIZZES
              </h1>
            </div>
            <p className="text-xs text-sky-400/70">
              Test your conceptual understanding with instant feedback and in-depth explanations.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-3 bg-slate-900/90 p-2 rounded-lg border border-sky-800/40 text-xs">
            <div>
              <span className="text-sky-400/60">Score: </span>
              <span className="text-cyan-300 font-bold">{userScore}</span>
            </div>
            <div className="border-l border-sky-800/40 pl-3">
              <span className="text-sky-400/60">Attempted: </span>
              <span className="text-sky-200 font-bold">{totalAttempted}</span>
            </div>
            <div className="border-l border-sky-800/40 pl-3">
              <span className="text-sky-400/60">Accuracy: </span>
              <span className="text-amber-400 font-bold">{accuracyPercent}%</span>
            </div>
          </div>
        </div>

        {notification && (
          <div className="p-3.5 rounded-lg bg-sky-950/90 border border-sky-400/60 text-sky-200 text-xs font-bold flex items-center gap-2 animate-bounce shadow-lg shadow-sky-950/50">
            <span>✨</span>
            <span>{notification}</span>
          </div>
        )}

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-950/90 border border-sky-800/40 rounded-xl text-xs">
          {/* Language Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sky-400/70 font-semibold">$ language:</span>
            <div className="flex flex-wrap gap-1">
              {(['all', 'python', 'c', 'java', 'javascript'] as LanguageFilter[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setCurrentQuestionIndex(0);
                    setSelectedOption(null);
                    setIsAnswerSubmitted(false);
                  }}
                  className={`px-2.5 py-1 rounded capitalize font-bold transition-all ${
                    selectedLanguage === lang
                      ? 'bg-sky-600/30 text-sky-200 border border-sky-400/50 shadow-sm shadow-sky-950'
                      : 'text-sky-400/60 hover:text-sky-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sky-400/70 font-semibold">$ difficulty:</span>
            <div className="flex flex-wrap gap-1">
              {(['all', 'beginner', 'intermediate', 'advanced'] as DifficultyFilter[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    setSelectedDifficulty(diff);
                    setCurrentQuestionIndex(0);
                    setSelectedOption(null);
                    setIsAnswerSubmitted(false);
                  }}
                  className={`px-2.5 py-1 rounded capitalize font-bold transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-400/50 shadow-sm shadow-cyan-950'
                      : 'text-sky-400/60 hover:text-sky-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIVE QUIZ QUESTION CARD */}
        {activeQuestion ? (
          <div className="terminal-card p-6 rounded-2xl border border-sky-800/40 bg-slate-950/90 max-w-3xl mx-auto space-y-6 shadow-xl shadow-sky-950/30">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-sky-800/30 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-sky-950/70 border border-sky-600/50 text-sky-300 font-bold uppercase tracking-wider">
                  {activeQuestion.language} • {activeQuestion.topic}
                </span>
                <span className="text-sky-400/60 capitalize font-mono">({activeQuestion.difficulty})</span>
              </div>
              <span className="text-amber-400 font-bold font-mono">+{activeQuestion.xp} XP</span>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-bold text-sky-100 leading-relaxed">
              {activeQuestion.question}
            </h2>

            {/* MCQ Options */}
            <div className="space-y-3">
              {activeQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === activeQuestion.correctIndex;
                let btnStyle = 'bg-slate-900/80 border-sky-900/40 text-sky-200 hover:border-sky-400 hover:bg-slate-850';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 font-bold shadow-md shadow-cyan-950/50';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold shadow-md shadow-rose-950/50';
                  } else {
                    btnStyle = 'bg-slate-950 border-slate-800 text-slate-600 opacity-50';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-sky-950/60 border-sky-400 text-sky-100 font-bold shadow-md shadow-sky-950';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-950 border border-sky-700/50 flex items-center justify-center text-xs font-bold text-cyan-300 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <span className="text-cyan-400 font-bold text-xs shrink-0">✓ Correct</span>
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <span className="text-rose-400 font-bold text-xs shrink-0">✕ Incorrect</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Drawer after Answering */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-700/40 text-xs space-y-2 animate-fadeIn shadow-inner shadow-slate-950">
                <div className="font-bold text-cyan-400 flex items-center gap-2">
                  <span>💡</span>
                  <span>CONCEPT BREAKDOWN</span>
                </div>
                <p className="text-sky-200/90 leading-relaxed">{activeQuestion.explanation}</p>
              </div>
            )}

            {/* Footer Navigation Bar */}
            <div className="flex items-center justify-between border-t border-sky-800/30 pt-4">
              <span className="text-xs text-sky-400/60 font-mono">
                Question {currentQuestionIndex + 1} of {filteredQuestions.length}
              </span>

              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="terminal-button text-xs py-2 px-6 bg-sky-500/25 text-sky-100 font-bold border-sky-400/50 hover:bg-sky-500/40 disabled:opacity-40"
                >
                  Submit Answer ❯
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="terminal-button text-xs py-2 px-6 bg-cyan-600/30 text-cyan-200 font-bold border-cyan-400/50 hover:bg-cyan-600/40"
                >
                  Next Question ❯
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="terminal-card p-12 text-center text-sky-400/60 text-xs">
            No quiz questions found matching the selected filters.
          </div>
        )}
      </div>
    </AppLayout>
  );
}
