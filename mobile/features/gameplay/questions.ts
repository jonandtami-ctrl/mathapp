import type { GameMode, NumericQuestion } from '../../types';

export const QUESTIONS_PER_SET = 20;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeTimesQuestion(): NumericQuestion {
  const a = randomInt(1, 12);
  const b = randomInt(1, 12);
  return { type: 'numeric', text: `${a} × ${b} = ?`, answer: a * b };
}

function makeSubtractionQuestion(): NumericQuestion {
  const a = randomInt(1, 50);
  const b = randomInt(1, a);
  return { type: 'numeric', text: `${a} - ${b} = ?`, answer: a - b };
}

function makeDivisionQuestion(): NumericQuestion {
  const divisor = randomInt(1, 12);
  const quotient = randomInt(1, 12);
  const dividend = divisor * quotient;
  return { type: 'numeric', text: `${dividend} ÷ ${divisor} = ?`, answer: quotient };
}

function makePercentageQuestion(): NumericQuestion {
  const percents = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];
  const percent = percents[randomInt(0, percents.length - 1)];
  const step = 100 / gcd(percent, 100);
  const base = step * randomInt(1, 20);
  const answer = (percent * base) / 100;
  return { type: 'numeric', text: `What is ${percent}% of ${base}?`, answer };
}

const generators: Record<Exclude<GameMode, 'mixed'>, () => NumericQuestion> = {
  times: makeTimesQuestion,
  subtraction: makeSubtractionQuestion,
  division: makeDivisionQuestion,
  percentages: makePercentageQuestion,
};

function makeMixedQuestion(): NumericQuestion {
  const keys = Object.keys(generators) as Array<Exclude<GameMode, 'mixed'>>;
  const key = keys[randomInt(0, keys.length - 1)];
  return generators[key]();
}

export function generateQuestions(mode: GameMode): NumericQuestion[] {
  const generator = mode === 'mixed' ? makeMixedQuestion : generators[mode];
  const set: NumericQuestion[] = [];
  for (let i = 0; i < QUESTIONS_PER_SET; i++) {
    set.push(generator());
  }
  return set;
}
