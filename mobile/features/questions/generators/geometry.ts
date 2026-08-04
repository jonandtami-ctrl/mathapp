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

const PI = 3.14;

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

// Grade 7-8 gets real middle-school geometry beyond rectangles: triangle
// area and circle measurements, rather than just bigger rectangles.
function triangleArea(grade: Grade, difficulty: Difficulty): EngineQuestion {
  const max = GRADE_DIMENSION_MAX[grade];
  const height = randomInt(2, max);
  const base = randomInt(1, Math.max(1, Math.floor(max / 2))) * 2; // even, so area is always a whole number
  const area = (base * height) / 2;

  const choices = makeChoices(String(area), () => {
    const variant = Math.random();
    if (variant < 0.34) return String(base * height); // forgot to halve
    if (variant < 0.67) return String(base + height); // wrong formula entirely
    return String(area + randomInt(1, 5) * (Math.random() < 0.5 ? 1 : -1));
  });

  return {
    id: makeId('geometry'),
    grade,
    category: 'geometry',
    difficulty,
    text: `A triangle has a base of ${base} units and a height of ${height} units. What is its area?`,
    answer: String(area),
    inputMode: 'choice',
    choices,
    visualAid: `triangle base ${base}, height ${height}`,
    explanation: `Area = 1/2 × base × height = 1/2 × ${base} × ${height} = ${area}`,
    xpValue: xpForDifficulty(difficulty),
  };
}

function circleMeasure(grade: Grade, difficulty: Difficulty, kind: 'circumference' | 'area'): EngineQuestion {
  const max = Math.min(GRADE_DIMENSION_MAX[grade], 20);
  const radius = randomInt(2, max);
  const circumference = Number((2 * PI * radius).toFixed(2));
  const area = Number((PI * radius * radius).toFixed(2));
  const answerValue = kind === 'circumference' ? circumference : area;

  const choices = makeChoices(String(answerValue), () => {
    const variant = Math.random();
    if (variant < 0.34) return String(kind === 'circumference' ? area : circumference); // confused formula
    if (variant < 0.67) return String(Number((PI * radius).toFixed(2))); // forgot to double the radius
    return String(Number((answerValue + randomInt(1, 5) * (Math.random() < 0.5 ? 1 : -1)).toFixed(2)));
  });

  return {
    id: makeId('geometry'),
    grade,
    category: 'geometry',
    difficulty,
    text: `A circle has a radius of ${radius} units. What is its ${kind}? (Use π ≈ 3.14)`,
    answer: String(answerValue),
    inputMode: 'choice',
    choices,
    visualAid: `circle radius ${radius}`,
    explanation:
      kind === 'circumference'
        ? `Circumference = 2 × π × r = 2 × 3.14 × ${radius} = ${circumference}`
        : `Area = π × r² = 3.14 × ${radius}² = ${area}`,
    xpValue: xpForDifficulty(difficulty),
  };
}

export function generateGeometry(grade: Grade, difficulty: Difficulty): EngineQuestion {
  if (difficulty === 1) return shapeIdentification(grade, difficulty);

  if (grade >= 7 && Math.random() < 0.5) {
    if (Math.random() < 0.5) return triangleArea(grade, difficulty);
    return circleMeasure(grade, difficulty, difficulty === 2 ? 'circumference' : 'area');
  }

  return perimeterOrArea(grade, difficulty, difficulty === 2 ? 'perimeter' : 'area');
}
