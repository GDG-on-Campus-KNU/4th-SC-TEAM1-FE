import React from 'react';
import toast from 'react-hot-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, X } from 'lucide-react';

import { GuestbookEntry, deleteGuestbookEntry, getMyGuestbookEntries } from '../apis';

type GuestBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const GuestBookModal: React.FC<GuestBookModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();

  const {
    data: entries = [],
    isLoading,
    isError,
  } = useQuery<GuestbookEntry[], Error>({
    queryKey: ['myGuestbook'],
    queryFn: getMyGuestbookEntries,
    enabled: isOpen,
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (guestbookId: number) => deleteGuestbookEntry(guestbookId),
    onSuccess: () => {
      toast.success('방명록 댓글을 삭제했습니다.');
      queryClient.invalidateQueries({ queryKey: ['myGuestbook'] });
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl sm:p-6">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 제목 */}
        <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">내 방명록</h2>

        {/* 방명록 리스트 */}
        <div className="max-h-80 space-y-4 overflow-y-auto pr-2">
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}
          {isError && (
            <div className="py-8 text-center text-red-500">방명록을 불러오지 못했습니다.</div>
          )}
          {!isLoading && entries.length === 0 && (
            <div className="py-8 text-center text-gray-500">작성된 방명록이 없습니다.</div>
          )}
          {!isLoading &&
            entries.map((e) => (
              <div
                key={e.guestbookId}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{e.senderNickname}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(e.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(e.guestbookId)}
                    disabled={deleteMutation.isPending}
                    className={`ml-4 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition ${
                      deleteMutation.isPending
                        ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                    지우기
                  </button>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-gray-700">{e.content}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GuestBookModal;
