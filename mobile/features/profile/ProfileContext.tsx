import React, { createContext, useContext, useEffect, useState } from 'react';
import { clearProfiles, getActiveProfileId, getProfiles, saveProfiles, setActiveProfileId } from '../../services/storage';
import { computeStars } from '../adventure/progress';
import type { AdventureProgress, Category, CategoryStat, ChildProfile, Grade } from '../../types';

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

type ProfileContextValue = {
  profile: ChildProfile | null;
  profiles: ChildProfile[];
  loading: boolean;
  needsOnboarding: boolean;
  completeOnboarding: (grade: Grade) => Promise<void>;
  resetProfile: () => Promise<void>;
  switchProfile: (id: string) => Promise<void>;
  updateGrade: (grade: Grade) => Promise<void>;
  recordQuizResult: (result: QuizResult) => Promise<void>;
  recordLevelResult: (result: LevelResult) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

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

function makeProfile(grade: Grade): ChildProfile {
  return {
    id: `profile-${Date.now()}`,
    nickname: 'Explorer',
    grade,
    avatar: '🦊',
    xp: 0,
    coins: 0,
    createdAt: new Date().toISOString(),
    questionsAttempted: 0,
    correctAnswers: 0,
    highestAnswerStreak: 0,
    dailyStreak: 0,
    lastPlayedDate: null,
    categoryStats: {},
    adventureProgress: {},
    perfectRounds: 0,
  };
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await getProfiles();
      if (stored.length > 0) {
        const id = (await getActiveProfileId()) ?? stored[0].id;
        if (!stored.some((p) => p.id === id)) {
          await setActiveProfileId(stored[0].id);
          setActiveId(stored[0].id);
        } else {
          setActiveId(id);
        }
        setProfiles(stored);
      }
      setLoading(false);
    })();
  }, []);

  async function completeOnboarding(grade: Grade) {
    const profile = makeProfile(grade);
    await saveProfiles([profile]);
    await setActiveProfileId(profile.id);
    setProfiles([profile]);
    setActiveId(profile.id);
  }

  async function resetProfile() {
    await clearProfiles();
    setProfiles([]);
    setActiveId(null);
  }

  async function switchProfile(id: string) {
    await setActiveProfileId(id);
    setActiveId(id);
  }

  async function updateGrade(grade: Grade) {
    const updated = profiles.map((p) => (p.id === activeId ? { ...p, grade } : p));
    setProfiles(updated);
    await saveProfiles(updated);
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
  const needsOnboarding = !loading && profiles.length === 0;

  return (
    <ProfileContext.Provider
      value={{
        profile,
        profiles,
        loading,
        needsOnboarding,
        completeOnboarding,
        resetProfile,
        switchProfile,
        updateGrade,
        recordQuizResult,
        recordLevelResult,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
