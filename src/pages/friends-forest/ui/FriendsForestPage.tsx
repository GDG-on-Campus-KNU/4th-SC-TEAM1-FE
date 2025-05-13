import { UserCheck, UserMinus, UserPlus, UserX } from 'lucide-react';

import Background from '../assets/forest_background.png';

const dummyFriends = [
  { id: 1, nickname: '도연', userId: 'doyeon123' },
  { id: 2, nickname: '민준', userId: 'minjun456' },
  { id: 3, nickname: '수빈', userId: 'soobin789' },
  { id: 4, nickname: '지훈', userId: 'jihun101' },
  { id: 5, nickname: '예린', userId: 'yerin202' },
  { id: 6, nickname: '하준', userId: 'hajun303' },
  { id: 7, nickname: '서연', userId: 'seoyeon404' },
  { id: 8, nickname: '우진', userId: 'woojin505' },
  { id: 9, nickname: '지아', userId: 'jia606' },
  { id: 10, nickname: '태현', userId: 'taehyun707' },
];

export const FriendsForestPage = () => {
  return (
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
            <button className="flex items-center justify-center gap-2 rounded-lg border border-green-300 bg-green-50 py-3 text-green-800 hover:bg-green-100 sm:px-0">
              <UserPlus className="h-5 w-5" /> 친구 요청 보내기
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 py-3 text-yellow-800 hover:bg-yellow-100 sm:px-0">
              <UserCheck className="h-5 w-5" /> 받은 요청 확인
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 py-3 text-red-800 hover:bg-red-100 sm:px-0">
              <UserX className="h-5 w-5" /> 거절한 요청 보기
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 py-3 text-gray-700 hover:bg-gray-100 sm:px-0">
              <UserMinus className="h-5 w-5" /> 친구 삭제하기
            </button>
          </div>
        </div>

        {/* 친구 목록 */}
        <div className="w-full max-w-xl rounded-xl bg-white/80 p-4 shadow-md sm:p-5">
          <h2 className="mb-3 text-center text-lg font-semibold text-green-700">내 친구 목록</h2>
          <div className="overflow-y-auto pr-1 sm:max-h-[35vh] md:max-h-[35vh]">
            <ul className="space-y-3">
              {dummyFriends.map((friend) => (
                <li
                  key={friend.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm text-gray-800 shadow-sm hover:bg-green-50 sm:px-4 sm:py-2.5"
                >
                  <div>
                    <span className="font-medium">{friend.nickname}</span>
                    <span className="ml-2 text-xs text-gray-500">({friend.userId})</span>
                  </div>
                  <button className="text-xs text-green-600 hover:underline">🌱 놀러가기</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
