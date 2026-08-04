import type { Grade } from '../../../types';
import type { Difficulty, EngineQuestion } from '../types';
import { makeId, randomInt, xpForDifficulty } from '../utils';

const NAMES = ['Maya', 'Liam', 'Zara', 'Noah', 'Priya', 'Ethan', 'Aria', 'Kai'];
const ITEMS = ['stickers', 'marbles', 'cookies', 'coins', 'cards', 'shells', 'crayons'];

const GRADE_MAX: Record<Grade, number> = {
  1: 8,
  2: 15,
  3: 20,
  4: 60,
  5: 200,
  6: 500,
  7: 1000,
  8: 2500,
};
const DIFFICULTY_FACTOR: Record<Difficulty, number> = { 1: 0.3, 2: 0.6, 3: 1 };

function pick<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

// Grade 1-2 hasn't learned multiplication/division facts yet: addition and
// subtraction story problems only. Multiplication joins at grade 3 (when
// it's introduced); division joins at grade 5, once multiplication is
// established.
function kindsForGrade(grade: Grade): Array<'addition' | 'subtraction' | 'multiplication' | 'division'> {
  if (grade <= 2) return ['addition', 'subtraction'];
  if (grade <= 4) return ['addition', 'subtraction', 'multiplication'];
  return ['addition', 'subtraction', 'multiplication', 'division'];
}

export function generateWordProblems(grade: Grade, difficulty: Difficulty): EngineQuestion {
  const max = Math.max(6, Math.floor(GRADE_MAX[grade] * DIFFICULTY_FACTOR[difficulty]));
  const name = pick(NAMES);
  const name2 = pick(NAMES.filter((n) => n !== name));
  const item = pick(ITEMS);
  const kind = pick(kindsForGrade(grade));

  if (kind === 'addition') {
    const a = randomInt(2, max);
    const b = randomInt(2, max);
    const answer = a + b;
    return {
      id: makeId('wordProblems'),
      grade,
      category: 'wordProblems',
      difficulty,
      text: `${name} has ${a} ${item}. ${name2} gives ${name} ${b} more ${item}. How many ${item} does ${name} have now?`,
      answer: String(answer),
      inputMode: 'numeric',
      explanation: `${a} + ${b} = ${answer}`,
      xpValue: xpForDifficulty(difficulty),
    };
  }

  if (kind === 'subtraction') {
    const a = randomInt(2, max);
    const b = randomInt(1, a);
    const answer = a - b;
    return {
      id: makeId('wordProblems'),
      grade,
      category: 'wordProblems',
      difficulty,
      text: `${name} had ${a} ${item} and gave ${b} to ${name2}. How many ${item} does ${name} have left?`,
      answer: String(answer),
      inputMode: 'numeric',
      explanation: `${a} - ${b} = ${answer}`,
      xpValue: xpForDifficulty(difficulty),
    };
  }

  if (kind === 'multiplication') {
    const bags = randomInt(2, Math.min(12, Math.max(3, Math.floor(max / 5))));
    const perBag = randomInt(2, Math.min(20, Math.max(3, Math.floor(max / bags))));
    const answer = bags * perBag;
    return {
      id: makeId('wordProblems'),
      grade,
      category: 'wordProblems',
      difficulty,
      text: `${name} has ${bags} bags with ${perBag} ${item} in each bag. How many ${item} does ${name} have in total?`,
      answer: String(answer),
      inputMode: 'numeric',
      explanation: `${bags} × ${perBag} = ${answer}`,
      xpValue: xpForDifficulty(difficulty),
    };
  }

  const friends = randomInt(2, Math.min(12, Math.max(3, Math.floor(max / 5))));
  const perFriend = randomInt(2, Math.min(20, Math.max(3, Math.floor(max / friends))));
  const total = friends * perFriend;
  return {
    id: makeId('wordProblems'),
    grade,
    category: 'wordProblems',
    difficulty,
    text: `${name} has ${total} ${item} and shares them equally among ${friends} friends. How many ${item} does each friend get?`,
    answer: String(perFriend),
    inputMode: 'numeric',
    explanation: `${total} ÷ ${friends} = ${perFriend}`,
    xpValue: xpForDifficulty(difficulty),
  };
}
