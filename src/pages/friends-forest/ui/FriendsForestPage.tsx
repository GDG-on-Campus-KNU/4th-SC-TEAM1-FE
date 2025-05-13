import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Inbox, Send, UserMinus, UserPlus } from 'lucide-react';

import { getFriendList } from '../apis/forestApi';
import Background from '../assets/forest_background.png';
import { FriendAddModal } from '../components';

export const FriendsForestPage = () => {
  const [showFriendAddModal, setShowFriendAddModal] = useState(false);

  const { data: friends, isLoading } = useQuery({
    queryKey: ['friendList'],
    queryFn: getFriendList,
  });

  return (
    <>
      {showFriendAddModal && <FriendAddModal onClose={() => setShowFriendAddModal(false)} />}
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

            <div className="grid gap-3 text-sm sm:grid-cols-2 sm:gap-4">
              <button
                onClick={() => setShowFriendAddModal(true)}
                className="flex items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 py-3 text-emerald-700 hover:bg-emerald-100 sm:px-0"
              >
                <UserPlus className="h-5 w-5" /> 친구 추가
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-rose-300 bg-rose-50 py-3 text-rose-700 hover:bg-rose-100 sm:px-0">
                <UserMinus className="h-5 w-5" /> 친구 삭제
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-sky-300 bg-sky-50 py-3 text-sky-700 hover:bg-sky-100 sm:px-0">
                <Send className="h-5 w-5" /> 보낸 요청
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 py-3 text-gray-700 hover:bg-gray-100 sm:px-0">
                <Inbox className="h-5 w-5" /> 받은 요청
              </button>
            </div>
          </div>

          {/* 친구 목록 */}
          <div className="w-full max-w-xl rounded-xl bg-white/80 p-4 shadow-md sm:p-5">
            <h2 className="mb-3 text-center text-lg font-semibold text-green-700">내 친구 목록</h2>
            <div className="min-h-[20vh] overflow-y-auto pr-1 sm:max-h-[35vh] md:max-h-[35vh]">
              {isLoading ? (
                <p className="text-center text-sm text-gray-500">불러오는 중...</p>
              ) : (
                <ul className="space-y-3">
                  {friends?.map((friend: { friendRequestId: number; friendId: string }) => (
                    <li
                      key={friend.friendRequestId}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm text-gray-800 shadow-sm hover:bg-green-50 sm:px-4 sm:py-2.5"
                    >
                      <div>
                        <span className="font-medium">{friend.friendId}</span>
                      </div>
                      <button className="text-xs text-green-600 hover:underline">
                        🌱 놀러가기
                      </button>
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
