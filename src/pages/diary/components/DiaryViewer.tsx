import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

import { deleteDiary, fetchDiaryDetail } from '../apis';
import type { DiaryDetail } from '../types';
import { DiaryEditor } from './DiaryEditor';

type DiaryViewerProps = {
  diaryId: number;
  date: Date;
  onClose: () => void;
  onDeleted: () => void;
};

export const DiaryViewer = ({ diaryId, date, onClose, onDeleted }: DiaryViewerProps) => {
  const [diary, setDiary] = useState<DiaryDetail | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const displayDate = date.toLocaleDateString();

  useEffect(() => {
    const loadDiary = async () => {
      try {
        const detail = await fetchDiaryDetail(diaryId);
        setDiary(detail ?? null);
      } catch {
        toast.error('일기 데이터를 불러오지 못했어요.');
        onClose();
      }
    };
    loadDiary();
  }, [diaryId, onClose]);

  if (!diary) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-xl bg-white px-6 py-6 text-center text-sm text-gray-600 shadow-md">
        일기 내용을 불러오는 중입니다...
      </div>
    );
  }

  if (isEditing) {
    return <DiaryEditor date={date} onClose={onClose} />;
  }

  return (
    <div className="relative mx-auto w-full rounded-xl bg-white px-4 pb-6 pt-4 shadow-md sm:max-w-sm lg:max-w-xl lg:px-6 lg:pt-6">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute right-3 top-3 z-10 text-lg text-gray-400 transition hover:scale-110 hover:text-gray-600"
      >
        ✕
      </button>

      <h2 className="mb-2 text-lg font-semibold text-primary">{displayDate}의 일기</h2>

      <p className="mb-4 text-sm text-gray-600">
        오늘의 감정:{' '}
        <span className="text-base">
          {diary.emotion === 'HAPPY'
            ? '😊 행복'
            : diary.emotion === 'SAD'
              ? '😢 슬픔'
              : diary.emotion === 'ANGRY'
                ? '😡 화남'
                : diary.emotion === 'EXCITED'
                  ? '😆 신남'
                  : '😐 보통'}
        </span>
      </p>

      <div className="prose prose-sm max-w-none leading-relaxed text-gray-800">
        <ReactMarkdown>{diary.content}</ReactMarkdown>
      </div>

      {/* 작성자인 경우만 수정/삭제 버튼 노출 */}
      {diary.isWriter && (
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-primary px-4 py-1 text-sm text-primary transition hover:bg-primary/10"
          >
            수정
          </button>
          <button
            onClick={async () => {
              const confirmDelete = confirm('정말 이 일기를 삭제하시겠어요?');
              if (!confirmDelete) return;

              try {
                await deleteDiary(diaryId);
                toast.success('일기가 삭제되었습니다.');
                onDeleted();
              } catch {
                toast.error('삭제에 실패했어요. 다시 시도해주세요.');
              }
            }}
            className="rounded-md border border-red-400 px-4 py-1 text-sm text-red-500 transition hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
};
