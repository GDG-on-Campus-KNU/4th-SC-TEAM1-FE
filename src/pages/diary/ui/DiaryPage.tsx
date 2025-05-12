import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

import { fetchMonthlyDiaries } from '../apis';
import Background from '../assets/Diary_background.png';
import { Calendar, DiaryEditor, DiaryViewer } from '../components';

export const DiaryPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'editor' | 'viewer' | 'none'>('none');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const {
    data: diaryData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['monthlyDiaries', year, month],
    queryFn: () => fetchMonthlyDiaries(year, month),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isError) {
      toast.error('세션이 만료되었어요. 다시 로그인해주세요.');
      navigate('/', { replace: true });
    }
  }, [isError, navigate]);

  const diaryDates: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    diaryData?.forEach(({ createdAt, emotion }) => {
      map[createdAt] = emotion;
    });
    return map;
  }, [diaryData]);

  const selectedDiary = useMemo(() => {
    const selectedStr = format(selectedDate, 'yyyy-MM-dd');
    return diaryData?.find((entry) => entry.createdAt === selectedStr);
  }, [diaryData, selectedDate]);

  useEffect(() => {
    if (!diaryData || diaryData.length === 0) return;

    const todayStr = format(today, 'yyyy-MM-dd');
    const hasDiaryToday = diaryData.some((entry) => entry.createdAt === todayStr);

    setSelectedDate(today);
    setViewMode(hasDiaryToday ? 'viewer' : 'editor');
  }, [diaryData, today]);

  const clickDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const todayStr = format(today, 'yyyy-MM-dd');
    const isToday = dateStr === todayStr;

    setSelectedDate(date);

    if (diaryDates[dateStr]) {
      setViewMode('viewer');
    } else if (isToday) {
      setViewMode('editor');
    } else {
      setViewMode('none');
    }
  };

  const deleteTheDiary = (deletedDate: Date) => {
    const todayStr = format(today, 'yyyy-MM-dd');
    const deletedStr = format(deletedDate, 'yyyy-MM-dd');
    const isToday = deletedStr === todayStr;

    queryClient.invalidateQueries({ queryKey: ['monthlyDiaries', year, month] });

    if (isToday) {
      setViewMode('editor');
    } else {
      const freshToday = new Date();
      freshToday.setHours(0, 0, 0, 0);
      setSelectedDate(freshToday);
      setViewMode('editor');
    }
  };

  const closeDiary = () => {
    setViewMode('none');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-gray-500">
        불러오는 중입니다...
      </div>
    );
  }

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
        <Calendar selected={selectedDate} onDayClick={clickDay} diaryDates={diaryDates} />
      </div>

      {/* 일기 작성 or 보기 영역 */}
      <div className="flex w-full justify-center pt-5 lg:w-1/2 lg:pt-10">
        {viewMode === 'editor' && <DiaryEditor date={selectedDate} onClose={closeDiary} />}
        {viewMode === 'viewer' && selectedDiary && (
          <DiaryViewer
            diaryId={selectedDiary.diaryId}
            date={selectedDate}
            onClose={closeDiary}
            onDeleted={() => deleteTheDiary(selectedDate)}
          />
        )}
      </div>
    </div>
  );
};
