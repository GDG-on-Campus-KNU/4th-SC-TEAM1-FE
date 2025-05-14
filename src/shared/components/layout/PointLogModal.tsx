// src/components/PointLogModal.tsx
import React, { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';

import { PointLogEntry, PointLogPage, fetchPointLogs } from '../../apis';

type PointLogModalProps = {
  onClose: () => void;
};

const translatePointType = (type: string): string => {
  if (type === 'GET_COMMENT_WRITER_ID') return '익명 닉네임 열람';
  if (type === 'DIARY') return '일기 작성';
  if (type === 'COMMENT') return '댓글 작성';
  if (type.startsWith('ATTENDANCE')) return '출석 보상';
  if (type === 'GROWTH_WATER') return '나무에 물주기';
  if (type === 'GROWTH_SUN') return '나무에 햇살주기';
  if (type === 'GROWTH_NUTRIENT') return '나무에 영양분주기';
  return type.replace(/_/g, ' ');
};

export const PointLogModal: React.FC<PointLogModalProps> = ({ onClose }) => {
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useQuery<
    PointLogPage,
    Error,
    PointLogPage,
    ['pointLogs', number]
  >({
    queryKey: ['pointLogs', page],
    queryFn: () => fetchPointLogs(page, 10, 'createdAt,desc'),
    staleTime: 5000,
  });

  const entries: PointLogEntry[] = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.number ?? 0;
  const isLast = data?.last ?? true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[80vh] w-full max-w-xs flex-col rounded-xl bg-white p-4 shadow-xl sm:max-w-md sm:p-6 md:max-w-lg">
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 제목 */}
        <h2 className="mb-4 text-center text-lg font-semibold text-gray-800">포인트 내역</h2>

        {/* 리스트 */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}

          {isError && (
            <div className="py-8 text-center text-red-500">불러오는 중 오류가 발생했습니다.</div>
          )}

          {!isLoading && !isError && entries.length === 0 && (
            <div className="py-8 text-center text-gray-500">아직 포인트 기록이 없습니다.</div>
          )}

          {!isLoading &&
            !isError &&
            entries.map((entry) => (
              <div
                key={`${entry.createdAt}-${entry.pointType}`}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {translatePointType(entry.pointType)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    entry.pointStatus === 'EARNED' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {entry.pointStatus === 'EARNED' ? '+' : '-'}
                  {entry.point} P
                </span>
              </div>
            ))}
        </div>

        {/* 페이징 */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-between text-xs text-gray-600">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              이전
            </button>
            <span>
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => !isLast && setPage((p) => p + 1)}
              disabled={isLast}
              className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
