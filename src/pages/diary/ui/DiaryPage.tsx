import { useState } from 'react';

import Background from '../assets/Diary_background.png';
import { Calendar, DiaryEditor } from '../components';

export const DiaryPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isEditorOpen, setIsEditorOpen] = useState(true);

  const handleDateSelect = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
      setIsEditorOpen(true);
    }
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-cover bg-fixed bg-no-repeat lg:flex-row lg:items-start lg:justify-between"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'bottom center',
      }}
    >
      {/* 캘린더 영역 */}
      <div className="flex w-full pt-5 lg:w-1/2 lg:pt-10">
        <Calendar selected={selectedDate} onSelect={handleDateSelect} />
      </div>

      {/* 일기 작성 영역 */}
      <div className="flex w-full justify-center pt-5 lg:w-1/2 lg:pt-10">
        {isEditorOpen && <DiaryEditor date={selectedDate} onClose={handleCloseEditor} />}
      </div>
    </div>
  );
};
