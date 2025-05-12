export type DiarySummary = {
  diaryId: number;
  createdAt: string;
  emotion: 'HAPPY' | 'SAD' | 'ANGRY' | 'EXCITED' | 'NEUTRAL';
};
