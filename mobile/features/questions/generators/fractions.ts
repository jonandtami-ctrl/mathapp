import type { Grade } from '../../../types';
import type { Difficulty, EngineQuestion } from '../types';
import { makeChoices, makeId, randomInt, simplifyFraction, xpForDifficulty } from '../utils';

function fractionLabel(numerator: number, denominator: number): string {
  const [n, d] = simplifyFraction(numerator, denominator);
  if (d === 1) return String(n);
  return `${n}/${d}`;
}

const DENOM_MAX: Record<Grade, number> = {
  1: 3,
  2: 4,
  3: 6,
  4: 8,
  5: 10,
  6: 12,
  7: 14,
  8: 16,
};

export function generateFractions(grade: Grade, difficulty: Difficulty): EngineQuestion {
  const useDifferentDenominators = difficulty === 3 || grade >= 5;
  const isAddition = difficulty === 1 || Math.random() < 0.5;
  const denomMax = DENOM_MAX[grade];

  let n1: number, d1: number, n2: number, d2: number, resultNum: number, resultDen: number;

  if (useDifferentDenominators) {
    d1 = randomInt(2, denomMax);
    do {
      d2 = randomInt(2, denomMax);
    } while (d2 === d1);
    n1 = randomInt(1, d1 - 1);
    n2 = randomInt(1, d2 - 1);
    resultDen = d1 * d2;
    resultNum = isAddition ? n1 * d2 + n2 * d1 : n1 * d2 - n2 * d1;
  } else {
    d1 = randomInt(2, denomMax);
    d2 = d1;
    n1 = randomInt(1, d1 - 1);
    n2 = isAddition ? randomInt(1, d1 - 1) : randomInt(1, n1);
    resultDen = d1;
    resultNum = isAddition ? n1 + n2 : n1 - n2;
  }

  if (resultNum < 0) {
    // Swap the full numerator/denominator pairs (not just numerators) so the
    // displayed expression still matches the recomputed, now-positive result.
    [n1, d1, n2, d2] = [n2, d2, n1, d1];
    resultNum = Math.abs(resultNum);
  }

  const correct = fractionLabel(resultNum, resultDen);
  const operator = isAddition ? '+' : '-';

  const choices = makeChoices(correct, () => {
    const bump = randomInt(-2, 2) || 1;
    const variant = Math.random();
    if (variant < 0.34) return fractionLabel(resultNum + bump, resultDen);
    if (variant < 0.67) return `${resultNum}/${resultDen}`; // unsimplified
    return fractionLabel(resultNum, Math.max(2, resultDen + bump));
  });

  return {
    id: makeId('fractions'),
    grade,
    category: 'fractions',
    difficulty,
    text: `${n1}/${d1} ${operator} ${n2}/${d2} = ?`,
    answer: correct,
    inputMode: 'choice',
    choices,
    explanation: `${n1}/${d1} ${operator} ${n2}/${d2} = ${resultNum}/${resultDen}, simplified to ${correct}`,
    xpValue: xpForDifficulty(difficulty),
  };
}
