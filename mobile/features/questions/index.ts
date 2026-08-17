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

// Grade a category is first appropriate for, based on U.S. Common Core
// standards: multiplication/division are introduced in Grade 3 (3.OA),
// fractions as numbers in Grade 3 (3.NF), and decimal notation in Grade 4
// (4.NF/4.NBT). Everything else (addition/subtraction, order-of-operations
// "number sentences", shape geometry, word problems) degrades to an
// age-appropriate form starting at Grade 1 within its own generator, so it
// has no hard floor here.
const CATEGORY_MIN_GRADE: Record<Category, Grade> = {
  addition: 1,
  subtraction: 1,
  multiplication: 3,
  division: 3,
  fractions: 3,
  decimals: 4,
  orderOfOperations: 1,
  geometry: 1,
  wordProblems: 1,
};

export function getAvailableCategories(grade: Grade): Category[] {
  return (Object.keys(generatorsByCategory) as Category[]).filter((c) => grade >= CATEGORY_MIN_GRADE[c]);
}

export function generateQuestion(category: Category, grade: Grade, difficulty: Difficulty): EngineQuestion {
  return generatorsByCategory[category](grade, difficulty);
}

// Generates `count` questions of a single category/difficulty, avoiding
// exact-duplicate text within the set where possible. Used by Adventure
// levels and boss battles.
export function generateQuestionSet(
  category: Category,
  grade: Grade,
  difficulty: Difficulty,
  count: number,
): EngineQuestion[] {
  const set: EngineQuestion[] = [];
  const seenTexts = new Set<string>();

  for (let i = 0; i < count; i++) {
    let question = generateQuestion(category, grade, difficulty);
    let attempts = 0;
    while (seenTexts.has(question.text) && attempts < 15) {
      question = generateQuestion(category, grade, difficulty);
      attempts += 1;
    }
    seenTexts.add(question.text);
    set.push(question);
  }

  return set;
}

const QUICK_PLAY_LENGTH = 10;

// Escalates difficulty across the session: easier questions first, harder later.
function difficultyForIndex(index: number): Difficulty {
  if (index < 3) return 1;
  if (index < 7) return 2;
  return 3;
}

export function generateQuickPlaySet(grade: Grade): EngineQuestion[] {
  const categories = getAvailableCategories(grade);
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
