import type { Grade } from '../../../types';
import type { Difficulty, EngineQuestion } from '../types';
import { makeChoices, makeId, randomInt, xpForDifficulty } from '../utils';

const SHAPES: { name: string; sides: number }[] = [
  { name: 'Triangle', sides: 3 },
  { name: 'Square', sides: 4 },
  { name: 'Pentagon', sides: 5 },
  { name: 'Hexagon', sides: 6 },
  { name: 'Octagon', sides: 8 },
];

const GRADE_DIMENSION_MAX: Record<Grade, number> = {
  1: 5,
  2: 8,
  3: 10,
  4: 15,
  5: 25,
  6: 40,
  7: 60,
  8: 90,
};

function shapeIdentification(grade: Grade, difficulty: Difficulty): EngineQuestion {
  const target = SHAPES[randomInt(0, SHAPES.length - 1)];
  const otherNames = SHAPES.filter((s) => s.name !== target.name).map((s) => s.name);
  const choices = makeChoices(target.name, () => otherNames[randomInt(0, otherNames.length - 1)]);

  return {
    id: makeId('geometry'),
    grade,
    category: 'geometry',
    difficulty,
    text: `Which shape has ${target.sides} sides?`,
    answer: target.name,
    inputMode: 'choice',
    choices,
    explanation: `A ${target.name.toLowerCase()} has ${target.sides} sides.`,
    xpValue: xpForDifficulty(difficulty),
  };
}

function perimeterOrArea(grade: Grade, difficulty: Difficulty, kind: 'perimeter' | 'area'): EngineQuestion {
  const max = GRADE_DIMENSION_MAX[grade];
  const width = randomInt(2, max);
  const height = randomInt(2, max);
  const perimeter = 2 * (width + height);
  const area = width * height;
  const answerValue = kind === 'perimeter' ? perimeter : area;

  const choices = makeChoices(String(answerValue), () => {
    const variant = Math.random();
    if (variant < 0.34) return String(kind === 'perimeter' ? area : perimeter); // confused formula
    if (variant < 0.67) return String(width + height); // forgot to double / multiply
    return String(answerValue + randomInt(1, 5) * (Math.random() < 0.5 ? 1 : -1));
  });

  return {
    id: makeId('geometry'),
    grade,
    category: 'geometry',
    difficulty,
    text: `A rectangle is ${width} units wide and ${height} units tall. What is its ${kind}?`,
    answer: String(answerValue),
    inputMode: 'choice',
    choices,
    visualAid: `${width}x${height} rectangle`,
    explanation:
      kind === 'perimeter'
        ? `Perimeter = 2 × (width + height) = 2 × (${width} + ${height}) = ${perimeter}`
        : `Area = width × height = ${width} × ${height} = ${area}`,
    xpValue: xpForDifficulty(difficulty),
  };
}

export function generateGeometry(grade: Grade, difficulty: Difficulty): EngineQuestion {
  if (difficulty === 1) return shapeIdentification(grade, difficulty);
  return perimeterOrArea(grade, difficulty, difficulty === 2 ? 'perimeter' : 'area');
}
