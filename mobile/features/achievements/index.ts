import { countBossDefeats } from '../adventure/progress';
import type { Category, ChildProfile } from '../../types';

export type Achievement = {
  id: string;
  name: string;
  icon: string;
  description: string;
  isUnlocked: (profile: ChildProfile) => boolean;
};

function categoryCorrect(profile: ChildProfile, category: Category): number {
  return profile.categoryStats[category]?.correct ?? 0;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-victory',
    name: 'First Victory',
    icon: '🥇',
    description: 'Answer your first question correctly.',
    isUnlocked: (p) => p.correctAnswers >= 1,
  },
  {
    id: 'ten-correct',
    name: 'Ten Correct Answers',
    icon: '🔟',
    description: 'Answer 10 questions correctly.',
    isUnlocked: (p) => p.correctAnswers >= 10,
  },
  {
    id: 'multiplication-master',
    name: 'Multiplication Master',
    icon: '✖️',
    description: 'Get 25 multiplication questions correct.',
    isUnlocked: (p) => categoryCorrect(p, 'multiplication') >= 25,
  },
  {
    id: 'fraction-hero',
    name: 'Fraction Hero',
    icon: '🍕',
    description: 'Get 25 fractions questions correct.',
    isUnlocked: (p) => categoryCorrect(p, 'fractions') >= 25,
  },
  {
    id: 'seven-day-streak',
    name: 'Seven-Day Streak',
    icon: '🔥',
    description: 'Play 7 days in a row.',
    isUnlocked: (p) => p.dailyStreak >= 7,
  },
  {
    id: 'hundred-questions',
    name: 'One Hundred Questions',
    icon: '💯',
    description: 'Answer 100 questions total.',
    isUnlocked: (p) => p.questionsAttempted >= 100,
  },
  {
    id: 'perfect-round',
    name: 'Perfect Round',
    icon: '🌟',
    description: 'Finish a Quick Play or level with 100% accuracy.',
    isUnlocked: (p) => p.perfectRounds >= 1,
  },
  {
    id: 'boss-champion',
    name: 'Boss Champion',
    icon: '🏆',
    description: 'Defeat your first Adventure Mode boss.',
    isUnlocked: (p) => countBossDefeats(p.adventureProgress) >= 1,
  },
  {
    id: 'practice-pro',
    name: 'Practice Pro',
    icon: '📚',
    description: 'Answer 500 questions total.',
    isUnlocked: (p) => p.questionsAttempted >= 500,
  },
  {
    id: 'epic-mathematician',
    name: 'Epic Mathematician',
    icon: '🧠',
    description: 'Defeat every Adventure Mode boss.',
    isUnlocked: (p) => countBossDefeats(p.adventureProgress) >= 8,
  },
];

export function getUnlockedAchievements(profile: ChildProfile): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.isUnlocked(profile));
}
