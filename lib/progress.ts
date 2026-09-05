export interface UserProgressData {
  xp: number;
  level: number;
  streak: number;
  problemsSolved: string[];
  completedLessons: string[];
  quizStats: {
    totalAnswered: number;
    totalCorrect: number;
    accuracy: number;
  };
  achievements: string[];
}

export function calculateLevel(xp: number): number {
  // 0 - 150: Level 1
  // 151 - 400: Level 2
  // 401 - 750: Level 3
  // 751 - 1200: Level 4
  // 1201+: Level 5+
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXpToNextLevel(xp: number): { currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  const level = calculateLevel(xp);
  const currentBase = Math.pow(level - 1, 2) * 100;
  const nextBase = Math.pow(level, 2) * 100;
  const range = nextBase - currentBase;
  const earned = xp - currentBase;
  const progressPercent = Math.min(100, Math.max(0, Math.round((earned / range) * 100)));

  return {
    currentLevelXp: earned,
    nextLevelXp: range,
    progressPercent,
  };
}

export function calculateLanguageProgress(
  completedLessons: string[],
  problemsSolved: string[]
): { python: number; c: number; java: number; javascript: number } {
  const pyCompleted = completedLessons.filter(l => l.startsWith('py-')).length + problemsSolved.filter(p => p.startsWith('py-') || p === 'reverse-string' || p === 'even-or-odd').length;
  const cCompleted = completedLessons.filter(l => l.startsWith('c-')).length + problemsSolved.filter(p => p.startsWith('c-')).length;
  const javaCompleted = completedLessons.filter(l => l.startsWith('java-')).length + problemsSolved.filter(p => p.startsWith('java-')).length;
  const jsCompleted = problemsSolved.filter(p => p.startsWith('js-')).length;

  return {
    python: Math.min(100, Math.max(15, Math.round((pyCompleted / 8) * 100))),
    c: Math.min(100, Math.max(10, Math.round((cCompleted / 6) * 100))),
    java: Math.min(100, Math.max(10, Math.round((javaCompleted / 6) * 100))),
    javascript: Math.min(100, Math.max(20, Math.round((jsCompleted / 4) * 100))),
  };
}
