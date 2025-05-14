import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

import { fetchMonthlyDiaries } from '../apis';
import Background from '../assets/Diary_background.png';
import loadingTodak from '../assets/todak_with_calendar.png';
import { Calendar, DiaryEditor, DiaryViewer } from '../components';

export const DiaryPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'editor' | 'viewer' | 'none'>('none');

  const [showPage, setShowPage] = useState(false);
  const startTimeRef = useRef(performance.now());

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
    if (!isLoading) {
      const MIN_DELAY = 1500;
      const elapsed = performance.now() - startTimeRef.current;
      const delay = Math.max(MIN_DELAY - elapsed, 0);

      const timer = setTimeout(() => {
        setShowPage(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isError) {
      toast.error('세션이 만료되었어요. 다시 로그인해주세요.');
      navigate('/', { replace: true });
    }
  }, [isError, navigate]);

  const diaryDates = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    diaryData?.forEach(({ createdAt, emotion }) => {
      map[createdAt] = emotion;
    });
    return map;
  }, [diaryData]);

  const selectedDiary = useMemo(() => {
    const key = format(selectedDate, 'yyyy-MM-dd');
    return diaryData?.find((entry) => entry.createdAt === key);
  }, [diaryData, selectedDate]);

  useEffect(() => {
    if (!diaryData) return;

    const todayStr = format(today, 'yyyy-MM-dd');
    const hasDiaryToday = diaryData.some((entry) => entry.createdAt === todayStr);

    setSelectedDate(today);
    setViewMode(hasDiaryToday ? 'viewer' : 'editor');
  }, [diaryData, today]);

  const clickDay = useCallback(
    (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const todayStr = format(today, 'yyyy-MM-dd');
      const isToday = dateStr === todayStr;

      setSelectedDate(date);

      if (diaryDates[dateStr]) {
        setViewMode('none');
        requestAnimationFrame(() => setViewMode('viewer'));
      } else if (isToday) {
        setViewMode('editor');
      } else {
        setViewMode('none');
      }
    },
    [today, diaryDates],
  );

  const deleteTheDiary = useCallback(
    (deletedDate: Date) => {
      queryClient.invalidateQueries({ queryKey: ['monthlyDiaries', year, month] });

      const deletedStr = format(deletedDate, 'yyyy-MM-dd');
      const todayStr = format(today, 'yyyy-MM-dd');
      const isToday = deletedStr === todayStr;

      if (isToday) {
        setViewMode('editor');
      } else {
        const fresh = new Date();
        fresh.setHours(0, 0, 0, 0);
        setSelectedDate(fresh);
        setViewMode('editor');
      }
    },
    [queryClient, year, month, today],
  );

  const closeDiary = useCallback(() => {
    setViewMode('none');
  }, []);

  if (!showPage || isLoading || diaryData === undefined) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-cover bg-fixed bg-no-repeat sm:h-[calc(100vh-53px)] md:h-[calc(100vh-57px)]"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundPosition: 'bottom center',
        }}
      >
        <img
          src={loadingTodak}
          alt="토닥이"
          className="mb-4 h-52 w-auto -translate-x-3 transform"
        />
        <div className="mb-4 text-lg font-bold text-gray-500">
          토닥이가 일기장을 가져오고 있어요...
        </div>
        <div className="flex space-x-2">
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary"></span>
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:.15s]"></span>
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:.3s]"></span>
        </div>
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

      {/* 일기 작성·조회 영역 */}
      <div className="flex w-full justify-center pt-5 lg:w-1/2 lg:pt-10">
        {viewMode === 'editor' && (
          <DiaryEditor mode="create" date={selectedDate} onClose={closeDiary} />
        )}
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
