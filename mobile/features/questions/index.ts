import type { Category, Grade } from '../../types';
import type { Difficulty, EngineQuestion, Generator } from './types';
import { generateAddition } from './generators/addition';
import { generateSubtraction } from './generators/subtraction';
import { generateMultiplication } from './generators/multiplication';
import { generateDivision } from './generators/division';
import { generateFractions } from './generators/fractions';
import { generateDecimals } from './generators/decimals';
import { generateOrderOfOperations } from './generators/orderOfOperations';
import { generateGeometry } from './generators/geometry';
import { generateWordProblems } from './generators/wordProblems';
import { randomInt } from './utils';

export type { EngineQuestion, Difficulty, InputMode } from './types';

export const CATEGORY_META: { key: Category; label: string; icon: string }[] = [
  { key: 'addition', label: 'Addition', icon: '➕' },
  { key: 'subtraction', label: 'Subtraction', icon: '➖' },
  { key: 'multiplication', label: 'Multiplication', icon: '✖️' },
  { key: 'division', label: 'Division', icon: '➗' },
  { key: 'fractions', label: 'Fractions', icon: '🍕' },
  { key: 'decimals', label: 'Decimals', icon: '🔢' },
  { key: 'orderOfOperations', label: 'Order of Operations', icon: '🧮' },
  { key: 'geometry', label: 'Geometry', icon: '📐' },
  { key: 'wordProblems', label: 'Word Problems', icon: '📖' },
];

const generatorsByCategory: Record<Category, Generator> = {
  addition: generateAddition,
  subtraction: generateSubtraction,
  multiplication: generateMultiplication,
  division: generateDivision,
  fractions: generateFractions,
  decimals: generateDecimals,
  orderOfOperations: generateOrderOfOperations,
  geometry: generateGeometry,
  wordProblems: generateWordProblems,
};

export function generateQuestion(category: Category, grade: Grade, difficulty: Difficulty): EngineQuestion {
  return generatorsByCategory[category](grade, difficulty);
}

const QUICK_PLAY_LENGTH = 10;

// Escalates difficulty across the session: easier questions first, harder later.
function difficultyForIndex(index: number): Difficulty {
  if (index < 3) return 1;
  if (index < 7) return 2;
  return 3;
}

export function generateQuickPlaySet(grade: Grade): EngineQuestion[] {
  const categories = Object.keys(generatorsByCategory) as Category[];
  const set: EngineQuestion[] = [];
  const seenTexts = new Set<string>();
  let lastCategory: Category | null = null;

  for (let i = 0; i < QUICK_PLAY_LENGTH; i++) {
    const difficulty = difficultyForIndex(i);
    let question: EngineQuestion | null = null;
    let attempts = 0;

    while (attempts < 15) {
      const category = categories[randomInt(0, categories.length - 1)];
      if (category === lastCategory && categories.length > 1) {
        attempts += 1;
        continue;
      }
      const candidate = generateQuestion(category, grade, difficulty);
      if (!seenTexts.has(candidate.text)) {
        question = candidate;
        break;
      }
      attempts += 1;
    }

    if (!question) {
      // Fallback: accept a possible repeat rather than looping forever.
      const category = categories[randomInt(0, categories.length - 1)];
      question = generateQuestion(category, grade, difficulty);
    }

    seenTexts.add(question.text);
    lastCategory = question.category;
    set.push(question);
  }

  return set;
}
