import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import Background from '../../diary/assets/Diary_background.png';
import loadingTodak from '../../diary/assets/todak_with_calendar.png';
import { FriendDiaryEntry, fetchFriendDiaries } from '../apis';
import FriendCalendar from '../components/FriendCalendar';
import FriendDiaryViewer from '../components/FriendDiaryViewer';

export const FriendDiary: React.FC = () => {
  const { friendId: rawFriendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!rawFriendId) navigate('/forests');
  }, [rawFriendId, navigate]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [viewerOpen, setViewerOpen] = useState(false);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const { data, isLoading, isError } = useQuery<FriendDiaryEntry[], Error>({
    queryKey: ['friendDiaries', rawFriendId, year, month],
    queryFn: () => fetchFriendDiaries(rawFriendId!, year, month),
    enabled: !!rawFriendId,
  });

  useEffect(() => {
    if (isLoading || !data) return;

    const key = format(selectedDate, 'yyyy-MM-dd');
    const exists = data.some((d) => d.createdAt === key);
    setViewerOpen(exists);
  }, [isLoading, data, selectedDate]);

  if (!rawFriendId) return null;
  if (isLoading || !data) {
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
          친구의 일기장을 가져오고 있어요...
        </div>
        <div className="flex space-x-2">
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:.15s]" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:.3s]" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-center text-red-500">친구 일기 목록을 불러올 수 없습니다.</div>;
  }

  const diaries = data;
  const diaryDates = diaries.reduce<Record<string, string>>((map, d) => {
    map[d.createdAt] = d.emotion;
    return map;
  }, {});

  const selectedKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedDiary = diaries.find((d) => d.createdAt === selectedKey);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const key = format(date, 'yyyy-MM-dd');
    setViewerOpen(!!diaryDates[key]);
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-cover bg-fixed bg-no-repeat lg:flex-row lg:items-start lg:justify-between"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'bottom center',
      }}
    >
      {/* 캘린더 */}
      <div className="flex w-full pt-5 sm:mt-8 lg:mt-5 lg:w-1/2">
        <FriendCalendar
          selectedDate={selectedDate}
          diaryDates={diaryDates}
          onDayClick={handleDayClick}
          friendId={rawFriendId!}
        />
      </div>

      {/* 일기 뷰어 */}
      <div className="flex w-full justify-center pt-5 lg:w-1/2 lg:pt-10">
        {viewerOpen && selectedDiary ? (
          <FriendDiaryViewer
            diaryId={selectedDiary.diaryId}
            date={selectedDate}
            onClose={() => setViewerOpen(false)}
          />
        ) : (
          <div className="text-center text-gray-400">
            친구가 아직 {format(selectedDate, 'yyyy년 MM월 dd일')}의 일기를 작성하지 않았어요.
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendDiary;
