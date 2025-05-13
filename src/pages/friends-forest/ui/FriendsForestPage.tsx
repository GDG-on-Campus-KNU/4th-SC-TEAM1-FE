import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Inbox, Send, UserPlus } from 'lucide-react';

import { deleteFriendRequest, getFriendList } from '../apis/forestApi';
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

  const { data: friends, isLoading } = useQuery<Friend[]>({
    queryKey: ['friendList'],
    queryFn: getFriendList,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFriendRequest(id),
    onSuccess: () => {
      toast.success('친구가 삭제되었습니다.');
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

            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3 sm:gap-2">
              <button
                onClick={() => setShowFriendAddModal(true)}
                className="flex items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 py-3 text-emerald-700 hover:bg-emerald-100 sm:gap-1 sm:px-0"
              >
                <UserPlus className="h-5 w-5" /> 친구 추가
              </button>
              <button
                onClick={() => setShowSentRequestModal(true)}
                className="flex items-center justify-center gap-2 rounded-lg border border-sky-300 bg-sky-50 py-3 text-sky-700 hover:bg-sky-100 sm:gap-1 sm:px-0"
              >
                <Send className="h-5 w-5" /> 보낸 요청
              </button>
              <button
                onClick={() => setShowReceivedRequestModal(true)}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 py-3 text-gray-700 hover:bg-gray-100 sm:gap-1 sm:px-0"
              >
                <Inbox className="h-5 w-5" /> 받은 요청
              </button>
            </div>
          </div>

          {/* 친구 목록 */}
          <div className="w-full max-w-xl rounded-xl bg-white/80 p-4 shadow-md sm:p-5">
            <h2 className="mb-3 text-center text-lg font-semibold text-green-700">내 친구 목록</h2>
            <div className="min-h-[20vh] overflow-y-auto pr-1 sm:max-h-[35vh] md:max-h-[35vh]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-6 text-center text-sm text-green-700">
                  <div className="mb-2 flex space-x-2">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-400" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:.15s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-600 [animation-delay:.3s]" />
                  </div>
                  <p className="mt-1 font-medium">숲에서 친구들을 찾고 있어요...</p>
                </div>
              ) : friends && friends.length === 0 ? (
                <div className="text-center text-sm text-gray-500">
                  친구가 아직 없어요. 친구를 추가해 보세요!
                </div>
              ) : (
                <ul className="space-y-3">
                  {friends?.map((friend) => (
                    <li
                      key={friend.friendRequestId}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm text-gray-800 shadow-sm hover:bg-green-50 sm:px-4 sm:py-2.5"
                    >
                      <div>
                        <span className="font-medium">{friend.friendId}</span>
                      </div>
                      <div className="flex gap-3">
                        <button className="text-xs text-green-600 hover:underline">
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
