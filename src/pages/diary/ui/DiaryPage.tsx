import { useEffect, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { fetchMonthlyDiaries } from '../apis';
import Background from '../assets/Diary_background.png';
import { Calendar, DiaryEditor, DiaryViewer } from '../components';

export const DiaryPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'editor' | 'viewer' | 'none'>('none');

  // ✅ today를 useMemo로 고정하여 useEffect 의존성 경고 해결
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const year = today.getFullYear();
  const month = today.getMonth() + 1;

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
  }, [diaryData, today]); // ✅ today 추가해도 now는 고정되어 있으므로 경고 없음

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
      setViewMode('none');
    }
  };

  const handleClose = () => {
    setViewMode('none');
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
        {viewMode === 'viewer' && <DiaryViewer date={selectedDate} onClose={handleClose} />}
      </div>
    </div>
  );
};
