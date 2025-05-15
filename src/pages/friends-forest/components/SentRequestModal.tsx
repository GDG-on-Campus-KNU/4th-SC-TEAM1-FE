import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { FriendRequestCount } from '../apis/forestApi';
import { deleteFriendRequest, getSentFriendRequests } from '../apis/forestApi';

type SentRequest = {
  friendRequestId: number;
  requesterName: string;
  accepterName: string;
  friendStatus: 'PENDING' | 'DECLINED';
};

export const SentRequestModal = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'DECLINED'>('PENDING');
  const queryClient = useQueryClient();
  const [pendingId, setPendingId] = useState<number | null>(null);

  const { data: requests = [], isLoading } = useQuery<SentRequest[]>({
    queryKey: ['sentFriendRequests'],
    queryFn: getSentFriendRequests,
  });

  const deleteMutation = useMutation<
    void,
    Error,
    number,
    { previousCounts?: FriendRequestCount[] }
  >({
    mutationFn: (id) => deleteFriendRequest(id),
    onMutate: async (id) => {
      void id;
      await queryClient.cancelQueries({ queryKey: ['friendRequestCounts'] });
      const previousCounts = queryClient.getQueryData<FriendRequestCount[]>([
        'friendRequestCounts',
      ]);
      queryClient.setQueryData<FriendRequestCount[]>(
        ['friendRequestCounts'],
        (old) =>
          old?.map((c) =>
            c.friendStatus === 'PENDING' && c.info === 'Requester'
              ? { ...c, count: c.count - 1 }
              : c,
          ) ?? [],
      );
      return { previousCounts };
    },
    onError: (_error, _id, context) => {
      if (context?.previousCounts) {
        queryClient.setQueryData(['friendRequestCounts'], context.previousCounts);
      }
    },
    onSuccess: () => {
      toast.success(activeTab === 'PENDING' ? '요청이 취소되었습니다.' : '요청이 삭제되었습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequestCounts'] });
      queryClient.invalidateQueries({ queryKey: ['sentFriendRequests'] });
    },
  });

  const filtered = requests.filter((r) => r.friendStatus === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <h2 className="mb-3 text-center text-lg font-bold text-green-800 sm:text-xl">
          📮 보낸 친구 요청
        </h2>

        <div className="mb-4 flex justify-center gap-3 text-sm sm:text-base">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`rounded-full px-4 py-1 font-medium transition ${
              activeTab === 'PENDING'
                ? 'bg-emerald-200 text-green-900'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            대기중
          </button>
          <button
            onClick={() => setActiveTab('DECLINED')}
            className={`rounded-full px-4 py-1 font-medium transition ${
              activeTab === 'DECLINED' ? 'bg-red-200 text-red-900' : 'bg-gray-100 text-gray-600'
            }`}
          >
            거절됨
          </button>
        </div>

        <p className="mb-2 text-center text-sm text-gray-600 sm:text-base">
          {activeTab === 'PENDING' ? '친구가 요청을 대기중입니다.' : '친구가 요청을 거절했습니다.'}
        </p>

        <div className="max-h-[35vh] min-h-[140px] overflow-y-auto rounded-md border p-2">
          {isLoading ? (
            <p className="text-center text-sm text-gray-500">불러오는 중이에요...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-400">표시할 요청이 없습니다 🌿</p>
          ) : (
            <ul className="space-y-2">
              {filtered.map((req) => (
                <li
                  key={req.friendRequestId}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm text-gray-800 shadow-sm hover:bg-green-50"
                >
                  <span className="font-medium">{req.accepterName}</span>
                  <button
                    onClick={() => {
                      setPendingId(req.friendRequestId);
                      deleteMutation.mutate(req.friendRequestId, {
                        onSettled: () => setPendingId(null),
                      });
                    }}
                    disabled={pendingId === req.friendRequestId}
                    className={`text-xs font-medium disabled:opacity-50 ${
                      activeTab === 'PENDING'
                        ? 'text-gray-500 hover:text-gray-700'
                        : 'text-red-500 hover:text-red-700'
                    }`}
                  >
                    {activeTab === 'PENDING' ? '요청 취소' : '지우기'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-300"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
