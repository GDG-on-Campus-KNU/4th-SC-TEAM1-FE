import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';

import {
  GuestbookEntry,
  GuestbookPayload,
  createGuestbookEntry,
  getGuestbookEntries,
} from '../apis';

type FriendGuestBookModalProps = {
  friendId: string;
  onClose: () => void;
};

export const FriendGuestBookModal: React.FC<FriendGuestBookModalProps> = ({
  friendId,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');

  const {
    data: entries = [],
    isPending: isPendingEntries,
    isError: isErrorEntries,
  } = useQuery<GuestbookEntry[], Error>({
    queryKey: ['guestbookEntries', friendId],
    queryFn: () => getGuestbookEntries(),
    enabled: !!friendId,
  });

  const { mutate: writeEntry, isPending: isPendingWrite } = useMutation<void, Error, void>({
    mutationFn: async () => {
      const payload: GuestbookPayload = { userId: friendId, content };
      return createGuestbookEntry(payload);
    },
    onSuccess: () => {
      toast.success('방명록을 남겼습니다');
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['guestbookEntries', friendId] });
    },
    onError: () => toast.error('방명록 작성에 실패했습니다'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col rounded-2xl bg-white p-6 shadow-xl">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">방명록</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 transition hover:text-gray-700"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 리스트 */}
        <div className="mb-4 flex-1 space-y-3 overflow-auto">
          {isPendingEntries && <div className="text-center text-gray-500">로딩 중…</div>}
          {isErrorEntries && <div className="text-center text-red-500">불러오기 실패</div>}
          {!isPendingEntries && entries.length === 0 && (
            <div className="text-center text-gray-400">아직 작성된 방명록이 없어요.</div>
          )}
          {!isPendingEntries &&
            entries.map((e) => (
              <div key={e.guestbookId} className="rounded-lg bg-gray-100 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{e.senderNickname}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(e.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-gray-700">{e.content}</p>
              </div>
            ))}
        </div>

        {/* 작성폼 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!content.trim()) return toast.error('내용을 입력해주세요');
            writeEntry();
          }}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="메시지를 입력하세요…"
            className="mb-3 h-24 w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={isPendingWrite}
            className={`w-full rounded-full py-2 font-medium text-white transition ${
              isPendingWrite ? 'cursor-not-allowed bg-primary/70' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isPendingWrite ? '작성 중…' : '작성하기'}
          </button>
        </form>
      </div>
    </div>
  );
};
