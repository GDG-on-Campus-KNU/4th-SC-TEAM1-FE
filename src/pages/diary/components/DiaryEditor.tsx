import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

import { Listbox } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Check, ChevronsUpDown, HelpCircle } from 'lucide-react';
import remarkBreaks from 'remark-breaks';

import { createDiary, fetchDiaryDetail, generateStorageUUID, updateDiary } from '../apis';
import type { DiaryDetail } from '../types';

const emotions = [
  { name: 'HAPPY', emoji: '😊' },
  { name: 'SAD', emoji: '😢' },
  { name: 'ANGRY', emoji: '😡' },
  { name: 'EXCITED', emoji: '😆' },
  { name: 'NEUTRAL', emoji: '😐' },
] as const;

export type EmotionType = (typeof emotions)[number]['name'];

type FormValues = {
  content: string;
  emotion: EmotionType;
};

type Props = {
  mode: 'create' | 'edit';
  date: Date;
  onClose: () => void;
  onSwitchToViewer?: (updatedDiary: DiaryDetail & { date: Date }) => void;
  diaryId?: number;
  defaultContent?: string;
  defaultEmotion?: EmotionType;
  storageUUID?: string;
};

export const DiaryEditor = ({
  mode,
  date,
  onClose,
  onSwitchToViewer,
  diaryId,
  defaultContent = '',
  defaultEmotion = 'HAPPY',
  storageUUID: passedUUID,
}: Props) => {
  const [storageUUID, setStorageUUID] = useState<string | null>(passedUUID ?? null);
  const [showTooltip, setShowTooltip] = useState(false);
  const queryClient = useQueryClient();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      emotion: defaultEmotion,
      content: defaultContent,
    },
    mode: 'onChange',
  });

  const content = watch('content');
  const emotionValue = watch('emotion');
  const selectedEmotion = emotions.find((e) => e.name === emotionValue) ?? emotions[0];

  useEffect(() => {
    if (mode === 'create' && !storageUUID) {
      const initUUID = async () => {
        try {
          const uuid = await generateStorageUUID();
          setStorageUUID(uuid);
        } catch {
          toast.error('스토리지를 초기화하지 못했어요. 다시 시도해 주세요.');
        }
      };
      initUUID();
    }
  }, [mode, storageUUID]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (mode === 'create') {
        if (!storageUUID) {
          toast.error('스토리지 UUID를 불러오는 중입니다. 잠시만 기다려 주세요.');
          return;
        }
        await createDiary({ ...data, storageUUID });
        toast.success('일기가 저장되었어요!');
        onClose();
      } else {
        if (!diaryId) {
          toast.error('잘못된 접근입니다. diaryId가 필요해요.');
          return;
        }
        await updateDiary(diaryId, {
          content: data.content,
          emotion: data.emotion,
        });
        toast.success('일기가 수정되었어요!');

        const updatedDiary = await fetchDiaryDetail(diaryId);
        if (updatedDiary) {
          onSwitchToViewer?.({ ...updatedDiary, date: new Date(updatedDiary.createdAt) });
        } else {
          toast.error('업데이트된 일기를 불러오지 못했어요.');
        }
      }

      queryClient.invalidateQueries({ queryKey: ['monthlyDiaries', year, month] });
    } catch {
      toast.error('저장 중 문제가 발생했어요. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="relative mx-auto w-full rounded-xl bg-white px-3 pb-4 pt-2 opacity-95 shadow-md sm:max-w-sm lg:max-w-xl lg:px-6 lg:pb-6 lg:pt-4">
      <button
        onClick={onClose}
        className="absolute right-3 top-3 z-10 text-lg text-gray-400 transition hover:scale-110 hover:text-gray-600"
      >
        ✕
      </button>

      <h2 className="mb-4 text-lg font-semibold text-primary">{date.toLocaleDateString()} 일기</h2>

      {/* 감정 선택 */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">오늘의 감정</label>
        <Listbox value={selectedEmotion} onChange={(emotion) => setValue('emotion', emotion.name)}>
          <div className="relative">
            <Listbox.Button className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-left text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary">
              <span>
                {selectedEmotion.emoji} {selectedEmotion.name}
              </span>
              <ChevronsUpDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-sm shadow-md ring-1 ring-black/10 focus:outline-none">
              {emotions.map((emotion) => (
                <Listbox.Option
                  key={emotion.name}
                  value={emotion}
                  className={({ active }) =>
                    `relative cursor-pointer select-none px-4 py-2 ${
                      active ? 'bg-primary text-white' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-between">
                      <span>
                        {emotion.emoji} {emotion.name}
                      </span>
                      {selected && <Check className="h-4 w-4 text-white" />}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {/* 내용 입력 */}
      <div className="mb-4">
        <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
          일기 내용 (Markdown 지원)
          <button
            type="button"
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-gray-400 hover:text-primary"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </label>
        {showTooltip && (
          <div className="mb-2 rounded-lg border border-primary/30 bg-green-50 p-4 text-sm text-gray-700 shadow-sm">
            <p className="mb-2 font-semibold text-primary">✨ 마크다운 문법 도움말</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <code>#</code>, <code>##</code> : 제목1, 제목2
              </li>
              <li>
                <code>-</code>, <code>*</code> : 리스트
              </li>
              <li>
                <code>**굵게**</code>, <code>*기울임*</code> : 텍스트 강조
              </li>
              <li>
                <code>---</code> : 구분선
              </li>
              <li>엔터 두 번: 줄 바꿈</li>
            </ul>
          </div>
        )}
        <textarea
          rows={18}
          placeholder="오늘 있었던 일을 Markdown 형식으로 적어보세요."
          className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('content', { required: '내용을 입력해주세요.' })}
        />
        {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>}
      </div>

      {/* 미리보기 */}
      {content.trim() !== '' && (
        <div className="mb-4 rounded-md border bg-gray-50 p-4 text-sm">
          <p className="mb-2 font-semibold text-gray-700">미리보기</p>
          <div className="space-y-2 leading-relaxed text-gray-800">
            <ReactMarkdown
              remarkPlugins={[remarkBreaks]}
              components={{
                h1: ({ ...props }) => <h1 className="text-xl font-bold" {...props} />,
                h2: ({ ...props }) => <h2 className="text-lg font-semibold" {...props} />,
                h3: ({ ...props }) => <h3 className="text-base font-medium" {...props} />,
                p: ({ ...props }) => <p className="text-sm" {...props} />,
                li: ({ ...props }) => <li className="ml-4 list-disc text-sm" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit(onSubmit)}
        disabled={!isValid}
        className="w-full rounded-lg bg-primary py-2 text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40"
      >
        {mode === 'create' ? '저장하기' : '수정하기'}
      </button>
    </div>
  );
};
