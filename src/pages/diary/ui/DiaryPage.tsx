import { useEffect, useMemo, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

import { fetchMonthlyDiaries } from '../apis';
import Background from '../assets/Diary_background.png';
import { Calendar, DiaryEditor, DiaryViewer } from '../components';

export const DiaryPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'editor' | 'viewer' | 'none'>('none');

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const queryClient = useQueryClient();

  const { data: diaryData = [] } = useQuery({
    queryKey: ['monthlyDiaries', year, month],
    queryFn: () => fetchMonthlyDiaries(year, month),
    staleTime: 1000 * 60 * 5,
  });

  const diaryDates: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    diaryData.forEach(({ createdAt, emotion }) => {
      map[createdAt] = emotion;
    });
    return map;
  }, [diaryData]);

  useEffect(() => {
    if (diaryData.length === 0) return;

    const todayStr = format(today, 'yyyy-MM-dd');
    const hasDiaryToday = diaryData.some((entry) => entry.createdAt === todayStr);

    setSelectedDate(today);
    setViewMode(hasDiaryToday ? 'viewer' : 'editor');
  }, [diaryData, today]);

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const todayStr = format(today, 'yyyy-MM-dd');
    const isToday = dateStr === todayStr;

    if (diaryDates[dateStr]) {
      setSelectedDate(date);
      setViewMode('viewer');
    } else if (isToday) {
      setSelectedDate(date);
      setViewMode('editor');
    } else {
      setSelectedDate(date);
      setViewMode('none');
    }
  };

  const handleClose = () => {
    setViewMode('none');
  };

  const selectedDiary = useMemo(() => {
    const selectedStr = format(selectedDate, 'yyyy-MM-dd');
    return diaryData.find((entry) => entry.createdAt === selectedStr);
  }, [diaryData, selectedDate]);

  const handleDiaryDeleted = (deletedDate: Date) => {
    const todayStr = format(today, 'yyyy-MM-dd');
    const deletedStr = format(deletedDate, 'yyyy-MM-dd');
    const isToday = deletedStr === todayStr;

    queryClient.invalidateQueries({ queryKey: ['monthlyDiaries', year, month] });

    if (isToday) {
      setViewMode('editor');
    } else {
      setSelectedDate(new Date(today));
      setViewMode('editor');
    }
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
        <Calendar selected={selectedDate} onDayClick={handleDayClick} diaryDates={diaryDates} />
      </div>

      {/* 일기 작성 or 보기 영역 */}
      <div className="flex w-full justify-center pt-5 lg:w-1/2 lg:pt-10">
        {viewMode === 'editor' && <DiaryEditor date={selectedDate} onClose={handleClose} />}
        {viewMode === 'viewer' && selectedDiary && (
          <DiaryViewer
            diaryId={selectedDiary.diaryId}
            date={selectedDate}
            onClose={handleClose}
            onDeleted={() => handleDiaryDeleted(selectedDate)}
          />
        )}
      </div>
    </div>
  );
};
