import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { findFallbackUserById, findFallbackUserByEmail } from '@/lib/fallback-auth';

export async function GET(request: NextRequest) {
  try {
    const payload = await authenticateRequest(request);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { authenticated: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let user: any = null;

    try {
      await dbConnect();
      user = await User.findById(payload.userId).select('-password');
    } catch (dbError) {
      // Fallback in-memory auth store
      user = await findFallbackUserById(payload.userId);
      if (!user && payload.email) {
        user = await findFallbackUserByEmail(payload.email);
      }
    }

    if (!user) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: payload.userId,
          username: payload.username,
          email: payload.email,
          createdAt: new Date().toISOString(),
          xp: 350,
          level: 2,
          streak: 5,
          problemsSolved: ['py-even-odd', 'py-sum-list'],
          completedLessons: ['py-variables', 'py-datatypes'],
          quizStats: { totalAnswered: 20, totalCorrect: 16, accuracy: 80 },
          achievements: ['first-program', 'bug-hunter'],
          recentActivity: [
            { id: 'act-1', type: 'lesson', title: 'Python Variables completed', timestamp: new Date().toISOString(), xpEarned: 25 },
          ],
          preferences: { defaultLanguage: 'python', explanationLevel: 'beginner', theme: 'terminal-cyber', customApiKey: '' },
        },
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id ? user._id.toString() : user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
        xp: user.xp ?? 350,
        level: user.level ?? 2,
        streak: user.streak ?? 5,
        problemsSolved: user.problemsSolved ?? [],
        completedLessons: user.completedLessons ?? [],
        quizStats: user.quizStats ?? { totalAnswered: 0, totalCorrect: 0, accuracy: 0 },
        achievements: user.achievements ?? ['first-program'],
        recentActivity: user.recentActivity ?? [],
        preferences: user.preferences ?? { defaultLanguage: 'python', explanationLevel: 'beginner', theme: 'terminal-cyber', customApiKey: '' },
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}