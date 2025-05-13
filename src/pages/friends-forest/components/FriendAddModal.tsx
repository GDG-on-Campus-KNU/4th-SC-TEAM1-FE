import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { useMutation } from '@tanstack/react-query';

import { sendFriendRequest } from '../apis/forestApi';

type FriendAddModalProps = {
  onClose: () => void;
};

export const FriendAddModal = ({ onClose }: FriendAddModalProps) => {
  const [friendId, setFriendId] = useState('');

  const mutation = useMutation({
    mutationFn: () => sendFriendRequest(friendId),
    onSuccess: () => {
      toast.success('친구 요청을 보냈어요!');
      onClose();
    },
    onError: () => {
      toast.error('친구 요청 실패! 아이디를 확인해 주세요😞');
    },
  });

  const submitId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendId.trim()) {
      toast.error('아이디를 입력해 주세요.');
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white px-5 py-6 shadow-2xl sm:max-w-md sm:px-6 sm:py-8">
        <h2 className="mb-5 text-center text-lg font-bold text-emerald-700 sm:text-xl">
          🍀 친구 추가하기
        </h2>
        <form onSubmit={submitId} className="space-y-4">
          <input
            type="text"
            placeholder="친구의 ID를 입력하세요"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            className="w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <div className="flex justify-end gap-2 text-sm sm:text-base">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
            >
              닫기
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? '보내는 중...' : '요청 보내기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
