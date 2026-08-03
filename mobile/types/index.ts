export type GameMode = 'times' | 'subtraction' | 'division' | 'percentages' | 'mixed';

export type NumericQuestion = {
  type: 'numeric';
  text: string;
  answer: number;
};

export type Question = NumericQuestion;

export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Category =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'fractions'
  | 'decimals'
  | 'orderOfOperations'
  | 'geometry'
  | 'wordProblems';

export type CategoryStat = {
  attempted: number;
  correct: number;
};

export type ChildProfile = {
  id: string;
  nickname: string;
  grade: Grade;
  avatar: string;
  xp: number;
  coins: number;
  createdAt: string;

  questionsAttempted: number;
  correctAnswers: number;
  highestAnswerStreak: number;
  dailyStreak: number;
  lastPlayedDate: string | null; // ISO yyyy-mm-dd
  categoryStats: Partial<Record<Category, CategoryStat>>;
};
