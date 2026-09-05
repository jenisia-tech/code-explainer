export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'practice' | 'streak' | 'mastery';
  xpReward: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-program',
    title: 'First Program',
    description: 'Executed your very first code snippet in the terminal workspace.',
    icon: '🏅',
    category: 'learning',
    xpReward: 50,
  },
  {
    id: 'bug-hunter',
    title: 'Bug Hunter',
    description: 'Diagnosed and resolved a runtime/syntax error using AI Debugger.',
    icon: '🐞',
    category: 'practice',
    xpReward: 75,
  },
  {
    id: 'python-beginner',
    title: 'Python Novice',
    description: 'Completed 3 fundamental lessons in the Python curriculum.',
    icon: '🧠',
    category: 'learning',
    xpReward: 100,
  },
  {
    id: '7-day-streak',
    title: '7 Day Streak',
    description: 'Maintained a coding streak for 7 consecutive days.',
    icon: '🔥',
    category: 'streak',
    xpReward: 150,
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Maintained over 80% accuracy across 20+ quiz challenges.',
    icon: '🎯',
    category: 'mastery',
    xpReward: 120,
  },
  {
    id: 'visualizer-explorer',
    title: 'Execution Architect',
    description: 'Stepped through code execution using the Code Visualizer.',
    icon: '🔍',
    category: 'learning',
    xpReward: 60,
  },
  {
    id: '50-problems-solved',
    title: 'Code Warrior',
    description: 'Successfully solved 10+ algorithm practice challenges.',
    icon: '⚡',
    category: 'practice',
    xpReward: 200,
  },
  {
    id: 'ai-collaborator',
    title: 'AI Collaborator',
    description: 'Had an in-depth coaching session with the AI Coding Tutor.',
    icon: '🤖',
    category: 'learning',
    xpReward: 50,
  },
];
