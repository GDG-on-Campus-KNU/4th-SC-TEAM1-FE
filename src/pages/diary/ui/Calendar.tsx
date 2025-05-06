// src/pages/diary/Calendar.tsx
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

type CalendarProps = {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
};

export const Calendar = ({ selected, onSelect }: CalendarProps) => {
  const defaultClassNames = getDefaultClassNames();
  return (
    <div className="w-full rounded-xl bg-white px-3 pb-4 pt-2 opacity-95 shadow-md sm:mx-2 sm:max-w-sm md:mx-auto md:max-w-lg md:px-6 md:pb-6 md:pt-4">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        locale={ko}
        formatters={{
          formatCaption: (date) => format(date, 'yyyy년 M월', { locale: ko }),
        }}
        modifiersClassNames={{
          selected: 'bg-primary text-white font-bold',
          today: 'text-primary font-semibold border-b-2 border-primary',
        }}
        classNames={{
          today: ``,
          selected: ``,
          root: `${defaultClassNames.root} shadow-lg p-3 pt-10 md:pl-20 md:pb-16`,
          chevron: `${defaultClassNames.chevron} fill-green-700`,
        }}
        showOutsideDays
        fixedWeeks
      />
    </div>
  );
};
