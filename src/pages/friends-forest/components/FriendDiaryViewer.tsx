// src/components/FriendDiaryViewer.tsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

import { X } from 'lucide-react';
import remarkBreaks from 'remark-breaks';

import { fetchDiaryDetail } from '../../diary/apis';
import { CommentSection } from '../../diary/components';
import type { DiaryDetail } from '../../diary/types';

const emotionLabels: Record<string, string> = {
  HAPPY: '🌞 마음이 따스한 하루',
  SAD: '🌧 마음에 비가 내려요',
  ANGRY: '🔥 마음이 울컥했어요',
  EXCITED: '🌈 설렘이 가득한 날',
  NEUTRAL: '🍃 평온하게 흘러간 하루',
};

const emotionColors: Record<string, string> = {
  HAPPY: 'bg-yellow-50',
  SAD: 'bg-blue-50',
  ANGRY: 'bg-red-50',
  EXCITED: 'bg-pink-50',
  NEUTRAL: 'bg-gray-50',
};

type FriendDiaryViewerProps = {
  diaryId: number;
  date: Date;
  onClose: () => void;
};

const FriendDiaryViewer: React.FC<FriendDiaryViewerProps> = ({ diaryId, date, onClose }) => {
  const [diary, setDiary] = useState<DiaryDetail | null>(null);
  const [ready, setReady] = useState(false);

  const displayDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const detail = await fetchDiaryDetail(diaryId);
        if (cancelled) return;
        if (!detail) {
          toast.error('친구의 일기를 찾을 수 없습니다.');
          onClose();
          return;
        }
        setDiary(detail);
        setTimeout(() => setReady(true), 300);
      } catch {
        toast.error('친구의 일기를 불러오지 못했습니다.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [diaryId, onClose]);

  if (!ready || !diary) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white px-6 py-8 text-center shadow-md sm:max-w-sm lg:max-w-xl">
        <div className="mb-4 text-[15px] leading-relaxed text-gray-800">
          친구의 추억을 펼치는 중… 📖
        </div>
        <div className="flex justify-center space-x-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:.15s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:.3s]" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-xl rounded-2xl bg-white px-6 pb-8 pt-6 shadow-md sm:max-w-sm lg:max-w-xl">
      {/* 닫기 */}
      <button
        onClick={onClose}
        className="absolute right-4 top-6 z-10 text-gray-400 transition hover:scale-110 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>

      {/* 날짜 & 감정 */}
      <div
        className={`mx-auto mb-6 max-w-[85%] rounded-lg border border-gray-200 px-4 py-3 text-center shadow-sm ${
          emotionColors[diary.emotion]
        }`}
      >
        <h2 className="text-base font-semibold text-gray-800">{displayDate}</h2>
        <p className="mt-1 text-sm text-gray-600">오늘의 감정: {emotionLabels[diary.emotion]}</p>
      </div>

      {/* 내용 */}
      <div className="prose max-w-none whitespace-pre-wrap text-gray-800">
        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{diary.content}</ReactMarkdown>
      </div>

      {/* 댓글 */}
      <CommentSection diaryId={diary.diaryId} />
    </div>
  );
};

export default FriendDiaryViewer;
