export type GameMode = 'times' | 'subtraction' | 'division' | 'percentages' | 'mixed';

export type NumericQuestion = {
  type: 'numeric';
  text: string;
  answer: number;
};

export type Question = NumericQuestion;

export type Grade = 3 | 4 | 5 | 6;

export type ChildProfile = {
  id: string;
  nickname: string;
  grade: Grade;
  avatar: string;
  xp: number;
  coins: number;
  createdAt: string;
};
