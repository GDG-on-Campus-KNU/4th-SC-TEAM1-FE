// src/components/FriendCalendar.tsx
import React, { useMemo } from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import '@pages/diary/styles/monthEmotions.css';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export type FriendCalendarProps = {
  selectedDate: Date;
  onDayClick: (date: Date) => void;
  diaryDates: Record<string, string>;
  friendId: string; // 친구 ID prop 추가
};

const FriendCalendar: React.FC<FriendCalendarProps> = ({
  selectedDate,
  onDayClick,
  diaryDates,
  friendId,
}) => {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const defaultClassNames = getDefaultClassNames();

  const getDatesByEmotion = (emotion: string) =>
    Object.entries(diaryDates)
      .filter(([, e]) => e === emotion)
      .map(([dateStr]) => new Date(dateStr));

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    onDayClick(date);
  };

  return (
    <div className="mx-auto w-full rounded-xl bg-white px-3 pb-4 pt-2 opacity-95 shadow-md sm:max-w-sm lg:max-w-xl lg:px-6 lg:pb-6 lg:pt-4">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        disabled={(date) => {
          const d = format(date, 'yyyy-MM-dd');
          const isToday = date.getTime() === today.getTime();
          const isFuture = date.getTime() > today.getTime();
          return (!diaryDates[d] && !isToday) || isFuture;
        }}
        locale={ko}
        formatters={{
          formatCaption: (date) =>
            `${format(date, 'yyyy년 M월,', { locale: ko })} ${friendId}의 일기`,
        }}
        modifiers={{
          happy: getDatesByEmotion('HAPPY'),
          sad: getDatesByEmotion('SAD'),
          angry: getDatesByEmotion('ANGRY'),
          excited: getDatesByEmotion('EXCITED'),
          neutral: getDatesByEmotion('NEUTRAL'),
        }}
        modifiersClassNames={{
          selected: 'bg-primary font-bold',
          today: 'font-semibold border-b-2 border-primary',
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

export default FriendCalendar;
