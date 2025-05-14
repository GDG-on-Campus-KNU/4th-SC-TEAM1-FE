import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Inbox, Send, UserPlus } from 'lucide-react';

import type { FriendRequestCount } from '../apis/forestApi';
import { deleteFriendRequest, getFriendList, getFriendRequestCounts } from '../apis/forestApi';
import Background from '../assets/forest_background.png';
import { FriendAddModal, ReceivedRequestModal, SentRequestModal } from '../components';

type Friend = {
  friendRequestId: number;
  friendId: string;
};

export const FriendsForestPage = () => {
  const [showFriendAddModal, setShowFriendAddModal] = useState(false);
  const [showSentRequestModal, setShowSentRequestModal] = useState(false);
  const [showReceivedRequestModal, setShowReceivedRequestModal] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: friends = [], isLoading: isFriendsLoading } = useQuery<Friend[]>({
    queryKey: ['friendList'],
    queryFn: getFriendList,
  });

  const { data: counts = [], isLoading: isCountsLoading } = useQuery<FriendRequestCount[]>({
    queryKey: ['friendRequestCounts'],
    queryFn: getFriendRequestCounts,
    staleTime: 1000 * 60,
  });

  const receivedPendingCount =
    counts.find((c) => c.friendStatus === 'PENDING' && c.info === 'Requester')?.count || 0;
  const sentPendingCount =
    counts.find((c) => c.friendStatus === 'PENDING' && c.info === 'Accepter')?.count || 0;
  const friendCount = counts.find((c) => c.friendStatus === 'ACCEPTED')?.count || friends.length;

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
          old?.map((c) => (c.friendStatus === 'ACCEPTED' ? { ...c, count: c.count - 1 } : c)) ?? [],
      );
      return { previousCounts };
    },
    onError: (_error, _id, context) => {
      if (context?.previousCounts) {
        queryClient.setQueryData(['friendRequestCounts'], context.previousCounts);
      }
    },
    onSuccess: () => {
      toast.success('친구가 삭제되었습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequestCounts'] });
      queryClient.invalidateQueries({ queryKey: ['friendList'] });
    },
  });

  return (
    <>
      {showFriendAddModal && <FriendAddModal onClose={() => setShowFriendAddModal(false)} />}
      {showSentRequestModal && <SentRequestModal onClose={() => setShowSentRequestModal(false)} />}
      {showReceivedRequestModal && (
        <ReceivedRequestModal onClose={() => setShowReceivedRequestModal(false)} />
      )}

      <div
        className="relative flex w-full flex-col bg-cover bg-no-repeat sm:h-[calc(100vh-53px)] md:h-[calc(100vh-57px)]"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundPosition: 'bottom center',
        }}
      >
        <div className="flex flex-1 flex-col items-center justify-start gap-6 px-4 pb-6 pt-8">
          <div className="w-full max-w-xl rounded-2xl bg-white/90 p-4 shadow-xl sm:p-6">
            <h1 className="mb-4 text-center text-xl font-bold text-green-800 sm:text-2xl">
              🌲 이웃숲 친구 관리
            </h1>
            <div className="flex flex-wrap justify-center gap-2 text-sm sm:gap-3">
              <button
                onClick={() => setShowFriendAddModal(true)}
                className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 hover:bg-emerald-100"
              >
                <UserPlus className="h-5 w-5" /> 친구 추가
              </button>
              <button
                onClick={() => setShowSentRequestModal(true)}
                className="relative flex items-center gap-1 whitespace-nowrap rounded-lg border border-sky-300 bg-sky-50 px-3 py-2 hover:bg-sky-100"
              >
                <Send className="h-5 w-5" /> 보낸 요청
                {!isCountsLoading && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-sky-600 px-1 text-xs font-semibold text-white">
                    {sentPendingCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowReceivedRequestModal(true)}
                className="relative flex items-center gap-1 whitespace-nowrap rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 hover:bg-gray-100"
              >
                <Inbox className="h-5 w-5" /> 받은 요청
                {!isCountsLoading && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gray-600 px-1 text-xs font-semibold text-white">
                    {receivedPendingCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* 친구 목록 */}
          <div className="w-full max-w-xl rounded-xl bg-white/80 p-4 shadow-md sm:p-5">
            <h2 className="mb-3 flex items-center justify-center gap-2 text-center text-lg font-semibold text-green-700">
              내 친구 목록
              {!isCountsLoading && (
                <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-medium text-white">
                  {friendCount}
                </span>
              )}
            </h2>

            <div className="min-h-[20vh] overflow-y-auto pr-1 sm:max-h-[35vh] md:max-h-[35vh]">
              {isFriendsLoading ? (
                <div className="flex flex-col items-center justify-center py-6 text-center text-sm text-green-700">
                  <div className="mb-2 flex space-x-2">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-400" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:.15s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-600 [animation-delay:.3s]" />
                  </div>
                  <p className="mt-1 font-medium">숲에서 친구들을 찾고 있어요...</p>
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center text-sm text-gray-500">
                  친구가 아직 없어요. 친구를 추가해 보세요!
                </div>
              ) : (
                <ul className="space-y-3">
                  {friends.map((friend) => (
                    <li
                      key={friend.friendRequestId}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm text-gray-800 shadow-sm hover:bg-green-50 sm:px-4 sm:py-2.5"
                    >
                      <div>
                        <span className="font-medium">{friend.friendId}</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/forests/${friend.friendId}`)}
                          className="text-xs text-green-600 hover:underline"
                        >
                          🌱 놀러가기
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('정말 친구를 삭제하시겠습니까?')) {
                              deleteMutation.mutate(friend.friendRequestId);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="text-xs text-red-500 hover:underline"
                        >
                          삭제
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
