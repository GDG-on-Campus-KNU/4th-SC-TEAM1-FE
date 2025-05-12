import { useMemo } from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import '@pages/diary/styles/monthEmotions.css';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { fetchMonthlyDiaries } from '../apis';
import type { DiarySummary } from '../types';

type CalendarProps = {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
};

const mapDiaryDatesByEmotion = (data: DiarySummary[] | undefined) => {
  const emotionMap: Record<string, Date[]> = {
    HAPPY: [],
    SAD: [],
    ANGRY: [],
    EXCITED: [],
    NEUTRAL: [],
  };

  (data ?? []).forEach(({ createdAt, emotion }) => {
    const [y, m, d] = createdAt.split('-').map(Number);
    const date = new Date(y, m - 1, d); // month 보정
    if (emotionMap[emotion]) {
      emotionMap[emotion].push(date);
    }
  });

  return emotionMap;
};

export const Calendar = ({ selected, onSelect }: CalendarProps) => {
  const defaultClassNames = getDefaultClassNames();

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const year = todayDate.getFullYear();
  const month = todayDate.getMonth() + 1;

  const { data: diaryData = [] } = useQuery({
    queryKey: ['monthlyDiaries', year, month],
    queryFn: () => fetchMonthlyDiaries(year, month),
    staleTime: 1000 * 60 * 5,
  });

  const {
    HAPPY: happyDays,
    SAD: sadDays,
    ANGRY: angryDays,
    EXCITED: excitedDays,
    NEUTRAL: neutralDays,
  } = useMemo(() => mapDiaryDatesByEmotion(diaryData), [diaryData]);

  return (
    <div className="mx-auto w-full rounded-xl bg-white px-3 pb-4 pt-2 opacity-95 shadow-md sm:max-w-sm lg:max-w-xl lg:px-6 lg:pb-6 lg:pt-4">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={{ after: todayDate }}
        locale={ko}
        formatters={{
          formatCaption: (date) => format(date, 'yyyy년 M월', { locale: ko }),
        }}
        modifiers={{
          happy: happyDays,
          sad: sadDays,
          angry: angryDays,
          excited: excitedDays,
          neutral: neutralDays,
        }}
        modifiersClassNames={{
          selected: 'bg-primary text-white font-bold',
          today: 'text-primary font-semibold border-b-2 border-primary',
          happy: 'my-happy-class',
          sad: 'my-sad-class',
          angry: 'my-angry-class',
          excited: 'my-excited-class',
          neutral: 'my-neutral-class',
        }}
        classNames={{
          root: `${defaultClassNames.root} shadow-lg p-3 pt-10 pl-8 lg:pl-16 lg:pb-16`,
          chevron: `${defaultClassNames.chevron} fill-green-700`,
          day: `${defaultClassNames.day} lg:p-2 md:m-1`,
        }}
        showOutsideDays
        fixedWeeks
      />
    </div>
  );
};
