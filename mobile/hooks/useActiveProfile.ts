import { useEffect, useState } from 'react';
import { getActiveProfileId, getProfiles, saveProfiles, setActiveProfileId } from '../services/storage';
import { sampleProfiles } from '../features/profile/sampleProfiles';
import { computeStars } from '../features/adventure/progress';
import type { AdventureProgress, Category, CategoryStat, ChildProfile } from '../types';

export type QuizResult = {
  xpEarned: number;
  coinsEarned: number;
  correctCount: number;
  totalCount: number;
  sessionHighestStreak: number;
  categoryBreakdown: Partial<Record<Category, CategoryStat>>;
};

export type LevelResult = {
  worldId: string;
  stageId: string;
  category: Category;
  xpEarned: number;
  coinsEarned: number;
  correctCount: number;
  totalCount: number;
};

type UseActiveProfileResult = {
  profile: ChildProfile | null;
  profiles: ChildProfile[];
  loading: boolean;
  switchProfile: (id: string) => Promise<void>;
  recordQuizResult: (result: QuizResult) => Promise<void>;
  recordLevelResult: (result: LevelResult) => Promise<void>;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function nextDailyStreak(profile: ChildProfile): { dailyStreak: number; lastPlayedDate: string } {
  const today = todayIso();
  if (profile.lastPlayedDate === today) {
    return { dailyStreak: profile.dailyStreak, lastPlayedDate: today };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const continuesStreak = profile.lastPlayedDate === yesterday;
  return { dailyStreak: continuesStreak ? profile.dailyStreak + 1 : 1, lastPlayedDate: today };
}

function mergeCategoryStats(
  existing: Partial<Record<Category, CategoryStat>>,
  incoming: Partial<Record<Category, CategoryStat>>,
): Partial<Record<Category, CategoryStat>> {
  const merged = { ...existing };
  for (const key of Object.keys(incoming) as Category[]) {
    const prev = merged[key] ?? { attempted: 0, correct: 0 };
    const add = incoming[key]!;
    merged[key] = { attempted: prev.attempted + add.attempted, correct: prev.correct + add.correct };
  }
  return merged;
}

export function useActiveProfile(): UseActiveProfileResult {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let stored = await getProfiles();
      if (stored.length === 0) {
        stored = sampleProfiles;
        await saveProfiles(stored);
      }

      let id = await getActiveProfileId();
      if (!id || !stored.some((p) => p.id === id)) {
        id = stored[0].id;
        await setActiveProfileId(id);
      }

      setProfiles(stored);
      setActiveId(id);
      setLoading(false);
    })();
  }, []);

  async function switchProfile(id: string) {
    await setActiveProfileId(id);
    setActiveId(id);
  }

  async function recordQuizResult(result: QuizResult) {
    const updated = profiles.map((p) => {
      if (p.id !== activeId) return p;
      const { dailyStreak, lastPlayedDate } = nextDailyStreak(p);
      const accuracy = result.totalCount === 0 ? 0 : result.correctCount / result.totalCount;
      return {
        ...p,
        xp: p.xp + result.xpEarned,
        coins: p.coins + result.coinsEarned,
        questionsAttempted: p.questionsAttempted + result.totalCount,
        correctAnswers: p.correctAnswers + result.correctCount,
        highestAnswerStreak: Math.max(p.highestAnswerStreak, result.sessionHighestStreak),
        dailyStreak,
        lastPlayedDate,
        categoryStats: mergeCategoryStats(p.categoryStats, result.categoryBreakdown),
        perfectRounds: p.perfectRounds + (accuracy === 1 ? 1 : 0),
      };
    });
    setProfiles(updated);
    await saveProfiles(updated);
  }

  async function recordLevelResult(result: LevelResult) {
    const updated = profiles.map((p) => {
      if (p.id !== activeId) return p;
      const { dailyStreak, lastPlayedDate } = nextDailyStreak(p);
      const accuracy = result.totalCount === 0 ? 0 : result.correctCount / result.totalCount;
      const stars = computeStars(accuracy);
      const key = `${result.worldId}:${result.stageId}`;
      const previous = p.adventureProgress[key];

      const adventureProgress: AdventureProgress = {
        ...p.adventureProgress,
        [key]: {
          stars: Math.max(previous?.stars ?? 0, stars) as 0 | 1 | 2 | 3,
          bestAccuracy: Math.max(previous?.bestAccuracy ?? 0, accuracy),
        },
      };

      return {
        ...p,
        xp: p.xp + result.xpEarned,
        coins: p.coins + result.coinsEarned,
        questionsAttempted: p.questionsAttempted + result.totalCount,
        correctAnswers: p.correctAnswers + result.correctCount,
        dailyStreak,
        lastPlayedDate,
        categoryStats: mergeCategoryStats(p.categoryStats, {
          [result.category]: { attempted: result.totalCount, correct: result.correctCount },
        }),
        adventureProgress,
        perfectRounds: p.perfectRounds + (accuracy === 1 ? 1 : 0),
      };
    });
    setProfiles(updated);
    await saveProfiles(updated);
  }

  const profile = profiles.find((p) => p.id === activeId) ?? null;

  return { profile, profiles, loading, switchProfile, recordQuizResult, recordLevelResult };
}
