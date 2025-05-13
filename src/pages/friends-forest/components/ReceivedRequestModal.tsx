import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  acceptFriendRequest,
  declineFriendRequest,
  deleteFriendRequest,
  getReceivedFriendRequests,
} from '../apis/forestApi';

type ReceivedRequest = {
  friendRequestId: number;
  requesterName: string;
  accepterName: string;
  friendStatus: 'PENDING' | 'DECLINED';
};

export const ReceivedRequestModal = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'DECLINED'>('PENDING');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<ReceivedRequest[]>({
    queryKey: ['receivedFriendRequests'],
    queryFn: getReceivedFriendRequests,
  });

  // 요청 수락
  const acceptMutation = useMutation({
    mutationFn: (id: number) => acceptFriendRequest(id),
    onSuccess: () => {
      toast.success('친구 요청을 수락했습니다.');
      queryClient.invalidateQueries({ queryKey: ['receivedFriendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friendList'] });
    },
  });

  // 요청 거절
  const declineMutation = useMutation({
    mutationFn: (id: number) => declineFriendRequest(id),
    onSuccess: () => {
      toast.success('친구 요청을 거절했습니다.');
      queryClient.invalidateQueries({ queryKey: ['receivedFriendRequests'] });
    },
  });

  // 거절된 요청 삭제
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFriendRequest(id),
    onSuccess: () => {
      toast.success('요청이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['receivedFriendRequests'] });
    },
  });

  const filtered = data?.filter((req) => req.friendStatus === activeTab) ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <h2 className="mb-3 text-center text-lg font-bold text-green-800 sm:text-xl">
          📥 받은 친구 요청
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
            대기중인 요청입니다.
          </button>
          <button
            onClick={() => setActiveTab('DECLINED')}
            className={`rounded-full px-4 py-1 font-medium transition ${
              activeTab === 'DECLINED' ? 'bg-red-200 text-red-900' : 'bg-gray-100 text-gray-600'
            }`}
          >
            거절한 요청입니다.
          </button>
        </div>

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
                  <span className="font-medium">{req.requesterName}</span>
                  <div className="flex gap-2">
                    {activeTab === 'PENDING' && (
                      <>
                        <button
                          onClick={() => acceptMutation.mutate(req.friendRequestId)}
                          disabled={acceptMutation.isPending}
                          className="text-xs text-green-600 hover:underline"
                        >
                          수락
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('정말 요청을 거절하시겠습니까?')) {
                              declineMutation.mutate(req.friendRequestId);
                            }
                          }}
                          disabled={declineMutation.isPending}
                          className="text-xs text-gray-500 hover:underline"
                        >
                          거절
                        </button>
                      </>
                    )}
                    {activeTab === 'DECLINED' && (
                      <button
                        onClick={() => {
                          if (window.confirm('정말 지우시겠습니까?')) {
                            deleteMutation.mutate(req.friendRequestId);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="text-xs text-red-500 hover:underline"
                      >
                        지우기
                      </button>
                    )}
                  </div>
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
