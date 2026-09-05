import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export interface ActivityItem {
  id: string;
  type: 'lesson' | 'problem' | 'quiz' | 'debug';
  title: string;
  timestamp: string;
  xpEarned: number;
}

export interface FallbackUser {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  problemsSolved: string[];
  completedLessons: string[];
  quizStats: {
    totalAnswered: number;
    totalCorrect: number;
    accuracy: number;
  };
  achievements: string[];
  recentActivity: ActivityItem[];
  preferences: {
    defaultLanguage: string;
    explanationLevel: string;
    theme: string;
    customApiKey: string;
  };
}

interface FallbackAuthState {
  users: Map<string, FallbackUser>;
  emailIndex: Map<string, string>;
}

const globalWithFallbackAuth = globalThis as typeof globalThis & {
  __fallbackAuthState?: FallbackAuthState;
};

function getFallbackState(): FallbackAuthState {
  if (!globalWithFallbackAuth.__fallbackAuthState) {
    globalWithFallbackAuth.__fallbackAuthState = {
      users: new Map<string, FallbackUser>(),
      emailIndex: new Map<string, string>(),
    };
  }

  return globalWithFallbackAuth.__fallbackAuthState;
}

function ensureSeedUser() {
  const state = getFallbackState();

  if (state.users.size > 0) {
    return;
  }

  const seedUser: FallbackUser = {
    id: 'fallback-demo-user',
    username: 'StudentCoder',
    email: 'student@code-explainer.dev',
    password: bcrypt.hashSync('demo123', 10),
    createdAt: new Date().toISOString(),
    xp: 450,
    level: 3,
    streak: 5,
    lastActiveDate: new Date().toISOString().split('T')[0],
    problemsSolved: ['py-even-odd', 'py-sum-list', 'js-reverse-string', 'c-max-number'],
    completedLessons: ['py-variables', 'py-datatypes', 'py-conditions', 'py-loops', 'c-variables', 'c-datatypes', 'java-variables'],
    quizStats: {
      totalAnswered: 35,
      totalCorrect: 29,
      accuracy: 83,
    },
    achievements: ['first-program', 'bug-hunter', 'python-beginner', 'quiz-master'],
    recentActivity: [
      { id: 'act-1', type: 'lesson', title: 'Completed Python Loops lesson', timestamp: new Date(Date.now() - 3600000).toISOString(), xpEarned: 25 },
      { id: 'act-2', type: 'debug', title: 'Debugged Array Index Out of Bounds', timestamp: new Date(Date.now() - 7200000).toISOString(), xpEarned: 15 },
      { id: 'act-3', type: 'quiz', title: 'Scored 100% on Functions Quiz', timestamp: new Date(Date.now() - 14400000).toISOString(), xpEarned: 30 },
      { id: 'act-4', type: 'problem', title: 'Solved Reverse a String challenge', timestamp: new Date(Date.now() - 28800000).toISOString(), xpEarned: 50 },
    ],
    preferences: {
      defaultLanguage: 'python',
      explanationLevel: 'beginner',
      theme: 'terminal-cyber',
      customApiKey: '',
    },
  };

  state.users.set(seedUser.id, seedUser);
  state.emailIndex.set(seedUser.email, seedUser.id);
}

export async function findFallbackUserByEmail(email: string): Promise<FallbackUser | null> {
  ensureSeedUser();
  const state = getFallbackState();
  const normalizedEmail = email.toLowerCase();
  const userId = state.emailIndex.get(normalizedEmail);

  if (!userId) {
    return null;
  }

  return state.users.get(userId) ?? null;
}

export async function findFallbackUserById(userId: string): Promise<FallbackUser | null> {
  ensureSeedUser();
  const state = getFallbackState();
  return state.users.get(userId) ?? null;
}

export async function updateFallbackUserProgress(
  userId: string,
  updater: (user: FallbackUser) => Partial<FallbackUser>
): Promise<FallbackUser | null> {
  ensureSeedUser();
  const state = getFallbackState();
  const user = state.users.get(userId);
  if (!user) return null;

  const updates = updater(user);
  const updatedUser: FallbackUser = {
    ...user,
    ...updates,
    quizStats: {
      ...user.quizStats,
      ...(updates.quizStats || {}),
    },
    preferences: {
      ...user.preferences,
      ...(updates.preferences || {}),
    },
  };

  state.users.set(userId, updatedUser);
  return updatedUser;
}

export async function createFallbackUser(input: {
  username: string;
  email: string;
  password: string;
}): Promise<FallbackUser | null> {
  ensureSeedUser();
  const state = getFallbackState();

  const normalizedEmail = input.email.toLowerCase();
  const normalizedUsername = input.username.trim();

  if (state.emailIndex.has(normalizedEmail)) {
    return null;
  }

  for (const user of state.users.values()) {
    if (user.username.toLowerCase() === normalizedUsername.toLowerCase()) {
      return null;
    }
  }

  const user: FallbackUser = {
    id: `fallback-${randomUUID()}`,
    username: normalizedUsername,
    email: normalizedEmail,
    password: await bcrypt.hash(input.password, 10),
    createdAt: new Date().toISOString(),
    xp: 100,
    level: 1,
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    problemsSolved: [],
    completedLessons: [],
    quizStats: {
      totalAnswered: 0,
      totalCorrect: 0,
      accuracy: 0,
    },
    achievements: ['first-program'],
    recentActivity: [
      { id: `act-${randomUUID()}`, type: 'lesson', title: 'Joined Code Explainer Academy', timestamp: new Date().toISOString(), xpEarned: 100 },
    ],
    preferences: {
      defaultLanguage: 'python',
      explanationLevel: 'beginner',
      theme: 'terminal-cyber',
      customApiKey: '',
    },
  };

  state.users.set(user.id, user);
  state.emailIndex.set(user.email, user.id);

  return user;
}

export async function verifyFallbackPassword(user: FallbackUser | null, password: string) {
  if (!user) {
    return false;
  }

  return bcrypt.compare(password, user.password);
}

