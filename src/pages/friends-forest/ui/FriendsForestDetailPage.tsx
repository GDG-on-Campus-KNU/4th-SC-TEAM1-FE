import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Bookmark } from 'lucide-react';

export const FriendsForestDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'guestbook' | 'diary' | 'default'>('default');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderContent = () => {
    switch (view) {
      case 'guestbook':
        return <div className="p-4">✍️ 방명록 작성 화면 (임시)</div>;
      case 'diary':
        return <div className="p-4">📖 일기 보기 화면 (임시)</div>;
      default:
        return <div className="p-4">🌳 친구의 숲 입구 상세보기 (임시)</div>;
    }
  };

  return (
    <div className="relative flex min-h-screen bg-green-50">
      {/* absolute 로 띄워서 메인 위에 겹치되, 버튼 모양은 그대로 유지 */}
      <aside className="absolute left-0 top-5 z-10 flex flex-row space-x-2 space-y-0 p-2 md:flex-col md:space-x-0 md:space-y-2 md:pl-0">
        {['숲 입구로 돌아가기', '방명록 작성하기', '일기 보기'].map((label, idx) => {
          const onClick =
            idx === 0
              ? () => navigate('/forests')
              : idx === 1
                ? () => setView('guestbook')
                : () => setView('diary');
          return (
            <button
              key={label}
              onClick={onClick}
              className="flex w-fit items-center gap-1 whitespace-nowrap py-2 pl-2 pr-5 text-sm text-gray-800 hover:text-gray-900"
              style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)',
              }}
            >
              <Bookmark className="hidden h-4 w-4 md:block" /> {label}
            </button>
          );
        })}
      </aside>

      {/* 메인 컨텐츠 영역 (사이드바와 겹치도록 ml 제거) */}
      <main
        className={`flex-1 p-6 transition-opacity delay-150 duration-700 ease-out ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {renderContent()}
      </main>
    </div>
  );
};
