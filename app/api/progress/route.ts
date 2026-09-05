import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { findFallbackUserById, updateFallbackUserProgress, FallbackUser } from '@/lib/fallback-auth';
import { calculateLevel } from '@/lib/progress';

export async function POST(req: NextRequest) {
  try {
    const payload = await authenticateRequest(req);
    const userId = payload?.userId || 'fallback-demo-user';

    const body = await req.json();
    const {
      xpEarned = 0,
      completedLessonId,
      solvedProblemId,
      quizResult, // { isCorrect: boolean, xp: number }
      activityTitle,
      activityType = 'lesson',
    } = body;

    let updatedUserData: any = null;

    try {
      await dbConnect();
      const user = await User.findById(userId);
      if (user) {
        user.xp = (user.xp || 0) + Number(xpEarned);
        user.level = calculateLevel(user.xp);

        if (completedLessonId && !user.completedLessons.includes(completedLessonId)) {
          user.completedLessons.push(completedLessonId);
        }

        if (solvedProblemId && !user.problemsSolved.includes(solvedProblemId)) {
          user.problemsSolved.push(solvedProblemId);
        }

        if (quizResult) {
          const stats = user.quizStats || { totalAnswered: 0, totalCorrect: 0, accuracy: 0 };
          stats.totalAnswered += 1;
          if (quizResult.isCorrect) stats.totalCorrect += 1;
          stats.accuracy = Math.round((stats.totalCorrect / stats.totalAnswered) * 100);
          user.quizStats = stats;
        }

        if (activityTitle) {
          user.recentActivity.unshift({
            id: `act-${Date.now()}`,
            type: activityType,
            title: activityTitle,
            timestamp: new Date().toISOString(),
            xpEarned: Number(xpEarned),
          });
          if (user.recentActivity.length > 20) {
            user.recentActivity = user.recentActivity.slice(0, 20);
          }
        }

        await user.save();
        updatedUserData = user.toObject();
      }
    } catch (dbError) {
      // In-memory fallback update
      updatedUserData = await updateFallbackUserProgress(userId, (user: FallbackUser) => {
        const newXp = (user.xp || 0) + Number(xpEarned);
        const newCompletedLessons = completedLessonId && !user.completedLessons.includes(completedLessonId)
          ? [...user.completedLessons, completedLessonId]
          : user.completedLessons;

        const newProblemsSolved = solvedProblemId && !user.problemsSolved.includes(solvedProblemId)
          ? [...user.problemsSolved, solvedProblemId]
          : user.problemsSolved;

        const newQuizStats = quizResult
          ? {
              totalAnswered: (user.quizStats?.totalAnswered || 0) + 1,
              totalCorrect: (user.quizStats?.totalCorrect || 0) + (quizResult.isCorrect ? 1 : 0),
              accuracy: Math.round(
                (((user.quizStats?.totalCorrect || 0) + (quizResult.isCorrect ? 1 : 0)) /
                  ((user.quizStats?.totalAnswered || 0) + 1)) *
                  100
              ),
            }
          : user.quizStats;

        const newRecentActivity = activityTitle
          ? [
              {
                id: `act-${Date.now()}`,
                type: activityType as any,
                title: activityTitle,
                timestamp: new Date().toISOString(),
                xpEarned: Number(xpEarned),
              },
              ...(user.recentActivity || []).slice(0, 19),
            ]
          : user.recentActivity;

        return {
          xp: newXp,
          level: calculateLevel(newXp),
          completedLessons: newCompletedLessons,
          problemsSolved: newProblemsSolved,
          quizStats: newQuizStats,
          recentActivity: newRecentActivity,
        };
      });
    }

    return NextResponse.json({
      success: true,
      user: updatedUserData,
    });
  } catch (error: any) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update progress' },
      { status: 500 }
    );
  }
}
