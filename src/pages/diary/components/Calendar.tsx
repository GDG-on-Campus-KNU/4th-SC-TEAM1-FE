// src/pages/diary/Calendar.tsx
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import '@pages/diary/styles/Dummy.css';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

type CalendarProps = {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
};

const dummyDays = [new Date(2025, 5, 31), new Date(2025, 4, 4), new Date(2025, 4, 5)]; // 월을 실제 월에서 -1 해줘야 됨.

export const Calendar = ({ selected, onSelect }: CalendarProps) => {
  const defaultClassNames = getDefaultClassNames();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="mx-auto w-full rounded-xl bg-white px-3 pb-4 pt-2 opacity-95 shadow-md sm:max-w-sm lg:max-w-xl lg:px-6 lg:pb-6 lg:pt-4">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={{ after: today }}
        locale={ko}
        formatters={{
          formatCaption: (date) => format(date, 'yyyy년 M월', { locale: ko }),
        }}
        modifiers={{
          dummy: dummyDays,
        }}
        modifiersClassNames={{
          selected: 'bg-primary text-white font-bold',
          today: 'text-primary font-semibold border-b-2 border-primary',
          dummy: 'my-dummy-class',
        }}
        classNames={{
          today: ``,
          selected: ``,
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
