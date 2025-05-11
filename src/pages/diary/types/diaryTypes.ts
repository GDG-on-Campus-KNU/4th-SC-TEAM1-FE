export type DiarySummary = {
  diaryId: number;
  createdAt: string; // e.g. "2025-05-09"
  emotion: 'HAPPY' | 'SAD' | 'ANGRY' | 'EXCITED' | 'NEUTRAL';
};
