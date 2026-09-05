'use client';

import { ACHIEVEMENTS, Achievement } from '@/lib/data/achievements';

interface GamificationBadgesProps {
  unlockedIds?: string[];
  maxDisplay?: number;
  showAll?: boolean;
}

export default function GamificationBadges({
  unlockedIds = ['first-program', 'bug-hunter', 'python-beginner'],
  maxDisplay,
  showAll = true,
}: GamificationBadgesProps) {
  const displayedAchievements = maxDisplay ? ACHIEVEMENTS.slice(0, maxDisplay) : ACHIEVEMENTS;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
      {displayedAchievements.map((badge: Achievement) => {
        const isUnlocked = unlockedIds.includes(badge.id);

        return (
          <div
            key={badge.id}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              isUnlocked
                ? 'bg-slate-900/90 border-sky-500/50 shadow-lg shadow-sky-950/50 text-sky-200 hover:border-sky-400'
                : 'bg-slate-950/40 border-slate-800/40 text-slate-600 opacity-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-sky-900/60 to-indigo-950 border border-sky-400/40 shadow-md shadow-sky-500/20'
                    : 'bg-slate-900 border border-slate-800'
                }`}
              >
                {badge.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold truncate ${isUnlocked ? 'text-sky-200' : 'text-slate-500'}`}>
                    {badge.title}
                  </h4>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">+{badge.xpReward} XP</span>
                </div>
                <p className="text-[11px] text-sky-400/70 mt-1 line-clamp-2 leading-tight">
                  {badge.description}
                </p>
                <div className="mt-2 text-[10px] font-semibold">
                  {isUnlocked ? (
                    <span className="text-cyan-400 flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-slate-600">🔒 Locked</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
