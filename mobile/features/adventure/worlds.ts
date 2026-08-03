import type { Category } from '../../types';
import type { Difficulty } from '../questions/types';
import type { BossStage, LevelStage, Stage, WorldDef, WorldId } from './types';

const LEVEL_DIFFICULTIES: Difficulty[] = [1, 1, 2, 2, 3];
const QUESTIONS_PER_LEVEL = 8;
const BOSS_HEALTH_HITS = 5;
const BOSS_MAX_ATTEMPTS = 8;

function buildStages(
  worldId: WorldId,
  levelCategories: [Category, Category, Category, Category, Category],
  boss: { category: Category; name: string; emoji: string },
): Stage[] {
  const levels: LevelStage[] = levelCategories.map((category, i) => ({
    kind: 'level',
    id: `${worldId}-level-${i + 1}`,
    stageIndex: i,
    category,
    difficulty: LEVEL_DIFFICULTIES[i],
    questionCount: QUESTIONS_PER_LEVEL,
  }));

  const bossStage: BossStage = {
    kind: 'boss',
    id: `${worldId}-boss`,
    stageIndex: levels.length,
    category: boss.category,
    difficulty: 3,
    bossName: boss.name,
    bossEmoji: boss.emoji,
    healthHits: BOSS_HEALTH_HITS,
    maxAttempts: BOSS_MAX_ATTEMPTS,
  };

  return [...levels, bossStage];
}

export const WORLDS: WorldDef[] = [
  {
    id: 'numberForest',
    name: 'Number Forest',
    icon: '🌲',
    colors: ['#38ef7d', '#11998e'],
    stages: buildStages(
      'numberForest',
      ['addition', 'subtraction', 'addition', 'subtraction', 'addition'],
      { category: 'subtraction', name: 'Grumble the Root Troll', emoji: '🌳' },
    ),
  },
  {
    id: 'multiplicationMountain',
    name: 'Multiplication Mountain',
    icon: '⛰️',
    colors: ['#4facfe', '#7b5ffc'],
    stages: buildStages(
      'multiplicationMountain',
      ['multiplication', 'multiplication', 'multiplication', 'multiplication', 'multiplication'],
      { category: 'multiplication', name: 'Boulderfang', emoji: '🗿' },
    ),
  },
  {
    id: 'divisionDunes',
    name: 'Division Dunes',
    icon: '🏜️',
    colors: ['#ff9a56', '#ff6a88'],
    stages: buildStages(
      'divisionDunes',
      ['division', 'division', 'division', 'division', 'division'],
      { category: 'division', name: 'Sandwyrm', emoji: '🐍' },
    ),
  },
  {
    id: 'fractionFalls',
    name: 'Fraction Falls',
    icon: '💧',
    colors: ['#4facfe', '#38ef7d'],
    stages: buildStages(
      'fractionFalls',
      ['fractions', 'fractions', 'fractions', 'fractions', 'fractions'],
      { category: 'fractions', name: 'Splitscale', emoji: '🐉' },
    ),
  },
  {
    id: 'decimalDesert',
    name: 'Decimal Desert',
    icon: '🏖️',
    colors: ['#f9748f', '#f78ca0'],
    stages: buildStages(
      'decimalDesert',
      ['decimals', 'decimals', 'decimals', 'decimals', 'decimals'],
      { category: 'decimals', name: 'Point Phantom', emoji: '👻' },
    ),
  },
  {
    id: 'geometryKingdom',
    name: 'Geometry Kingdom',
    icon: '🏰',
    colors: ['#a06cd5', '#7b5ffc'],
    stages: buildStages(
      'geometryKingdom',
      ['geometry', 'geometry', 'geometry', 'geometry', 'geometry'],
      { category: 'geometry', name: 'Shapeshifter King', emoji: '🤖' },
    ),
  },
  {
    id: 'orderOfOperationsGalaxy',
    name: 'Algebra Galaxy',
    icon: '🌌',
    colors: ['#6d5bd0', '#4facfe'],
    stages: buildStages(
      'orderOfOperationsGalaxy',
      [
        'orderOfOperations',
        'orderOfOperations',
        'orderOfOperations',
        'orderOfOperations',
        'orderOfOperations',
      ],
      { category: 'orderOfOperations', name: 'Captain Precedence', emoji: '👽' },
    ),
  },
  {
    id: 'wordProblemWoods',
    name: 'Word Problem Woods',
    icon: '📖',
    colors: ['#ff9a56', '#38ef7d'],
    stages: buildStages(
      'wordProblemWoods',
      ['wordProblems', 'wordProblems', 'wordProblems', 'wordProblems', 'wordProblems'],
      { category: 'wordProblems', name: 'Riddle Robot', emoji: '🤖' },
    ),
  },
];

export function getWorld(worldId: WorldId): WorldDef {
  return WORLDS.find((w) => w.id === worldId)!;
}
