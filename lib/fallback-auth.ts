import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export interface FallbackUser {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
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
    username: 'demo',
    email: 'demo@example.com',
    password: bcrypt.hashSync('demo123', 10),
    createdAt: new Date().toISOString(),
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
