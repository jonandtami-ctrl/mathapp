// XP required to go from `level` to `level + 1`. Grows each level so higher
// levels take slightly longer to reach.
export function xpToNextLevel(level: number): number {
  return 100 + (level - 1) * 25;
}

export type LevelInfo = {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number; // 0 - 1
};

export function getLevelInfo(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = totalXp;

  while (remaining >= xpToNextLevel(level)) {
    remaining -= xpToNextLevel(level);
    level += 1;
  }

  const xpForNextLevel = xpToNextLevel(level);
  return {
    level,
    xpIntoLevel: remaining,
    xpForNextLevel,
    progress: xpForNextLevel === 0 ? 0 : remaining / xpForNextLevel,
  };
}
