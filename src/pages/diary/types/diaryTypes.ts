export type DiarySummary = {
  diaryId: number;
  createdAt: string;
  emotion: 'HAPPY' | 'SAD' | 'ANGRY' | 'EXCITED' | 'NEUTRAL';
};

export type DiaryDetail = {
  diaryId: number;
  createdAt: string;
  content: string;
  emotion: 'HAPPY' | 'SAD' | 'ANGRY' | 'EXCITED' | 'NEUTRAL';
  storageUUID: string;
  isWriter: boolean;
  date?: Date;
};
