import { CATEGORY_META } from '../questions';
import type { Category, ChildProfile } from '../../types';

export type Tip = {
  icon: string;
  message: string;
};

const MIN_SAMPLE_SIZE = 5; // don't judge a category off one lucky/unlucky guess
const NEEDS_WORK_THRESHOLD = 0.7;

// Derives a short, encouraging list of tips from real play data - never
// shaming, always pointing at something concrete to try next.
export function getImprovementTips(profile: ChildProfile): Tip[] {
  if (profile.questionsAttempted === 0) {
    return [{ icon: '🚀', message: 'Play a Quick Play session to start earning tips made just for you!' }];
  }

  const tips: Tip[] = [];
  const overallAccuracy = profile.correctAnswers / profile.questionsAttempted;

  const categoryEntries = (Object.keys(profile.categoryStats) as Category[])
    .map((key) => ({ key, stat: profile.categoryStats[key]! }))
    .filter((e) => e.stat.attempted >= MIN_SAMPLE_SIZE);

  if (categoryEntries.length > 0) {
    const weakest = categoryEntries.reduce((worst, entry) => {
      const accuracy = entry.stat.correct / entry.stat.attempted;
      const worstAccuracy = worst.stat.correct / worst.stat.attempted;
      return accuracy < worstAccuracy ? entry : worst;
    });
    const weakestAccuracy = weakest.stat.correct / weakest.stat.attempted;

    if (weakestAccuracy < NEEDS_WORK_THRESHOLD) {
      const meta = CATEGORY_META.find((m) => m.key === weakest.key)!;
      tips.push({
        icon: meta.icon,
        message: `${meta.label} is at ${Math.round(weakestAccuracy * 100)}% - a few more rounds in Adventure Mode will level it up fast!`,
      });
    }
  }

  if (profile.highestAnswerStreak < 5) {
    tips.push({
      icon: '🔥',
      message: 'Answer a few in a row correctly to build a streak - streaks earn bonus confetti!',
    });
  }

  if (profile.dailyStreak === 0) {
    tips.push({ icon: '📅', message: 'Come back and play tomorrow to start a daily streak!' });
  }

  if (tips.length === 0 && overallAccuracy >= 0.85) {
    tips.push({ icon: '🌟', message: "You're crushing it! Try a tougher boss battle to really test yourself." });
  }

  if (tips.length === 0) {
    tips.push({ icon: '💪', message: 'Keep practicing a little every day to master new skills!' });
  }

  return tips.slice(0, 3);
}
