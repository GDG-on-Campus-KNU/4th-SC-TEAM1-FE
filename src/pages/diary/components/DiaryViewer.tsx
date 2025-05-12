import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

import { Pencil, Trash2, X } from 'lucide-react';
import remarkBreaks from 'remark-breaks';

import { deleteDiary, fetchDiaryDetail } from '../apis';
import type { DiaryDetail } from '../types';
import { CommentSection } from './CommentSection';
import { DiaryEditor } from './DiaryEditor';

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

type DiaryViewerProps = {
  diaryId: number;
  date: Date;
  onClose: () => void;
  onDeleted: () => void;
};

export const DiaryViewer = ({ diaryId, date, onClose, onDeleted }: DiaryViewerProps) => {
  const [diary, setDiary] = useState<(DiaryDetail & { date: Date }) | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isReadyToRender, setIsReadyToRender] = useState(false);

  const displayDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  useEffect(() => {
    const loadDiary = async () => {
      try {
        const detail = await fetchDiaryDetail(diaryId);
        if (!detail) {
          toast.error('일기를 찾을 수 없습니다.');
          setIsReadyToRender(true);
          return;
        }

        setDiary({ ...detail, date: new Date(detail.createdAt) });
        setTimeout(() => setIsReadyToRender(true), 1000);
      } catch {
        toast.error('일기 데이터를 불러오지 못했어요.');
        onClose();
      }
    };

    loadDiary();
  }, [diaryId, onClose]);

  if (!diary || !isReadyToRender) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-xl bg-white px-6 py-8 text-center shadow-md">
        <div className="mb-4 text-[15px] font-normal leading-relaxed text-gray-800">
          잠시만요, 추억을 펼치는 중이에요... 📖
        </div>
        <div className="flex justify-center space-x-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary"></span>
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:.15s]"></span>
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:.3s]"></span>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <DiaryEditor
        mode="edit"
        date={diary.date}
        diaryId={diary.diaryId}
        defaultContent={diary.content}
        defaultEmotion={diary.emotion}
        storageUUID={diary.storageUUID}
        onClose={onClose}
        onSwitchToViewer={(updatedDiary) => {
          setDiary(updatedDiary); // 수정된 데이터 반영
          setIsEditing(false); // 다시 뷰어 모드로 전환
        }}
      />
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-xl rounded-2xl bg-white px-6 pb-8 pt-6 shadow-md sm:max-w-sm lg:max-w-xl">
      <button
        onClick={onClose}
        className="absolute right-4 top-6 z-10 text-gray-400 transition hover:scale-110 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className={`mx-auto mb-6 max-w-[85%] rounded-lg border border-gray-200 px-4 py-3 text-center shadow-sm ${
          emotionColors[diary.emotion]
        }`}
      >
        <h2 className="text-base font-semibold text-gray-800">{displayDate}</h2>
        <p className="mt-1 text-sm text-gray-600">오늘의 감정: {emotionLabels[diary.emotion]}</p>
      </div>

      <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-gray-800">
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          components={{
            h1: ({ ...props }) => <h1 className="text-xl font-bold text-gray-700" {...props} />,
            h2: ({ ...props }) => <h2 className="text-lg font-semibold text-gray-700" {...props} />,
            h3: ({ ...props }) => <h3 className="text-base font-medium text-gray-700" {...props} />,
            p: ({ ...props }) => <p className="text-sm" {...props} />,
            li: ({ ...props }) => <li className="ml-4 list-disc text-sm" {...props} />,
            blockquote: ({ ...props }) => (
              <blockquote
                className="border-l-4 border-gray-300 pl-4 italic text-gray-600"
                {...props}
              />
            ),
          }}
        >
          {diary.content}
        </ReactMarkdown>
      </div>

      {diary.isWriter && (
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 rounded-md border border-gray-300 px-4 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
          >
            <Pencil className="h-4 w-4" />
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
            className="flex items-center gap-1 rounded-md border border-gray-300 px-4 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            삭제
          </button>
        </div>
      )}
      <CommentSection diaryId={diary.diaryId} />
    </div>
  );
};
