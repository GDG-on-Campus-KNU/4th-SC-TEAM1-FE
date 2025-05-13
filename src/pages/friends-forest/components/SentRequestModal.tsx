import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { deleteFriendRequest, getSentFriendRequests } from '../apis/forestApi';

type Request = {
  friendRequestId: number;
  requesterName: string;
  accepterName: string;
  friendStatus: 'PENDING' | 'DECLINED';
};

export const SentRequestModal = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'DECLINED'>('PENDING');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Request[]>({
    queryKey: ['sentFriendRequests'],
    queryFn: getSentFriendRequests,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFriendRequest(id),
    onSuccess: () => {
      const message = activeTab === 'PENDING' ? '요청이 취소되었습니다.' : '요청이 삭제되었습니다.';
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ['sentFriendRequests'] });
    },
  });

  const filteredData = data?.filter((req) => req.friendStatus === activeTab) || [];

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
          {activeTab === 'PENDING' ? '친구가 요청을 대기중이에요' : '친구가 요청을 거절했어요'}
        </p>

        <div className="max-h-[35vh] min-h-[140px] overflow-y-auto rounded-md border p-2">
          {isLoading ? (
            <p className="text-center text-sm text-gray-500">불러오는 중이에요...</p>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-sm text-gray-400">조용한 하루에요 🌿</p>
          ) : (
            <ul className="space-y-2">
              {filteredData.map((req) => (
                <li
                  key={req.friendRequestId}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm text-gray-800 shadow-sm hover:bg-green-50"
                >
                  <span className="font-medium">{req.accepterName}</span>
                  <button
                    onClick={() => {
                      const confirmMsg =
                        activeTab === 'PENDING'
                          ? '정말 요청을 취소하시겠습니까?'
                          : '정말 지우시겠습니까?';
                      if (window.confirm(confirmMsg)) {
                        deleteMutation.mutate(req.friendRequestId);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className={`text-xs font-medium ${
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
