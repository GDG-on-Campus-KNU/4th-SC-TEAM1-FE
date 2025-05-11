import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

import { Listbox } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import remarkBreaks from 'remark-breaks';

import { createDiary, generateStorageUUID } from '../apis';

const emotions = [
  { name: 'HAPPY', emoji: '😊' },
  { name: 'SAD', emoji: '😢' },
  { name: 'ANGRY', emoji: '😡' },
  { name: 'EXCITED', emoji: '😆' },
  { name: 'NEUTRAL', emoji: '😐' },
] as const;

type EmotionType = (typeof emotions)[number]['name'];

type Props = {
  date: Date;
  onClose: () => void;
};

export const DiaryEditor = ({ date, onClose }: Props) => {
  const [markdown, setMarkdown] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState(emotions[0]);
  const [storageUUID, setStorageUUID] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  useEffect(() => {
    const initUUID = async () => {
      try {
        const uuid = await generateStorageUUID();
        setStorageUUID(uuid);
      } catch {
        toast.error('스토리지를 초기화하지 못했어요. 다시 시도해 주세요.');
      }
    };
    initUUID();
  }, []);

  const handleSave = async () => {
    if (!storageUUID) {
      toast.error('스토리지 UUID를 불러오는 중입니다. 잠시만 기다려 주세요.');
      return;
    }

    try {
      await createDiary({
        content: markdown,
        emotion: selectedEmotion.name as EmotionType,
        storageUUID,
      });
      toast.success('일기가 저장되었어요!');
      queryClient.invalidateQueries({ queryKey: ['monthlyDiaries', year, month] });
      onClose();
    } catch {
      toast.error('일기 저장에 실패했어요. 다시 시도해 주세요.');
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

      <h2 className="mb-4 text-lg font-semibold text-primary">
        {date.toLocaleDateString()}의 일기
      </h2>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">오늘의 감정</label>
        <Listbox value={selectedEmotion} onChange={setSelectedEmotion}>
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

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          일기 내용 (Markdown 지원)
        </label>
        <textarea
          rows={18}
          placeholder="오늘 있었던 일을 Markdown 형식으로 적어보세요."
          className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
      </div>

      {markdown.trim() !== '' && (
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
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        className="w-full rounded-lg bg-primary py-2 text-white transition hover:bg-primary/90"
      >
        저장하기
      </button>
    </div>
  );
};
