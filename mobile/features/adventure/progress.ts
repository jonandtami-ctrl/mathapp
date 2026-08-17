import { WORLDS } from './worlds';
import type { AdventureProgress, StageProgress, StarRating, Stage, WorldDef } from './types';

export function progressKey(worldId: string, stageId: string): string {
  return `${worldId}:${stageId}`;
}

export function getStageProgress(
  progress: AdventureProgress,
  worldId: string,
  stageId: string,
): StageProgress | undefined {
  return progress[progressKey(worldId, stageId)];
}

export function computeStars(accuracy: number): StarRating {
  if (accuracy >= 0.9) return 3;
  if (accuracy >= 0.7) return 2;
  if (accuracy >= 0.5) return 1;
  return 0;
}

export function isStageUnlocked(world: WorldDef, stage: Stage, progress: AdventureProgress): boolean {
  if (stage.stageIndex === 0) return true;
  const previous = world.stages[stage.stageIndex - 1];
  const previousProgress = getStageProgress(progress, world.id, previous.id);
  return (previousProgress?.stars ?? 0) >= 1;
}

// `availableWorlds` should be the grade-filtered list (see getAvailableWorlds)
// so the unlock chain skips over worlds not yet appropriate for the child's
// grade, rather than getting stuck on one that has nothing to show.
export function isWorldUnlocked(world: WorldDef, availableWorlds: WorldDef[], progress: AdventureProgress): boolean {
  const index = availableWorlds.findIndex((w) => w.id === world.id);
  if (index <= 0) return true;
  const previousWorld = availableWorlds[index - 1];
  const bossStage = previousWorld.stages[previousWorld.stages.length - 1];
  const bossProgress = getStageProgress(progress, previousWorld.id, bossStage.id);
  return (bossProgress?.stars ?? 0) >= 1;
}

export function getWorldStarTotal(world: WorldDef, progress: AdventureProgress): { earned: number; max: number } {
  const earned = world.stages.reduce((sum, stage) => sum + (getStageProgress(progress, world.id, stage.id)?.stars ?? 0), 0);
  return { earned, max: world.stages.length * 3 };
}

export function countBossDefeats(progress: AdventureProgress): number {
  let count = 0;
  for (const world of WORLDS) {
    const bossStage = world.stages[world.stages.length - 1];
    if ((getStageProgress(progress, world.id, bossStage.id)?.stars ?? 0) >= 1) count += 1;
  }
  return count;
}
