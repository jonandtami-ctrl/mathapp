import type { Category } from '../../types';
import type { Difficulty } from '../questions/types';

export type { StarRating, StageProgress, AdventureProgress } from '../../types';

export type WorldId =
  | 'numberForest'
  | 'multiplicationMountain'
  | 'divisionDunes'
  | 'fractionFalls'
  | 'decimalDesert'
  | 'orderOfOperationsGalaxy'
  | 'geometryKingdom'
  | 'wordProblemWoods';

export type LevelStage = {
  kind: 'level';
  id: string;
  stageIndex: number;
  category: Category;
  difficulty: Difficulty;
  questionCount: number;
};

export type BossStage = {
  kind: 'boss';
  id: string;
  stageIndex: number;
  category: Category;
  difficulty: Difficulty;
  bossName: string;
  bossEmoji: string;
  healthHits: number; // correct answers needed to defeat the boss
  maxAttempts: number; // question slots available in the battle
};

export type Stage = LevelStage | BossStage;

export type WorldDef = {
  id: WorldId;
  name: string;
  icon: string;
  colors: readonly [string, string, ...string[]];
  stages: Stage[];
};
