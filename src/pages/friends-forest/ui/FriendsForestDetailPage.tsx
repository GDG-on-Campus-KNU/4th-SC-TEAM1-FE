import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Bookmark } from 'lucide-react';

import { FriendTree } from '../components';

export const FriendsForestDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'default' | 'guestbook' | 'diary'>('guestbook');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const items = [
    { label: '숲 입구로 돌아가기', key: 'default' },
    { label: '친구 나무와 방명록', key: 'guestbook' },
    { label: '친구 일기', key: 'diary' },
  ] as const;

  const renderContent = () => {
    switch (view) {
      case 'guestbook':
        return <FriendTree />;
      case 'diary':
        return <div className="p-4">📖 일기 보기 화면 (임시)</div>;
      default:
        return <FriendTree />;
    }
  };

  return (
    <div className="relative flex bg-green-50">
      {/* BOOKMARK SIDEBAR */}
      <aside className="absolute left-1/2 z-10 flex -translate-x-1/2 flex-row justify-between space-x-2 p-2 md:left-0 md:top-5 md:translate-x-0 md:flex-col md:space-x-0 md:space-y-2 md:pl-0">
        {items.map(({ label, key }) => {
          const isActive = view === key;
          const onClick = () => {
            if (key === 'default') {
              navigate('/forests');
            } else {
              setView(key);
            }
          };

          return (
            <button
              key={key}
              onClick={onClick}
              className={`flex w-fit items-center gap-1 whitespace-nowrap py-2 pl-2 pr-5 text-sm transition-colors ${
                isActive ? 'bg-primary text-white' : 'bg-white/90 text-gray-800 hover:text-gray-900'
              } `}
              style={{ clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)' }}
            >
              <Bookmark className="hidden h-4 w-4 md:block" />
              {label}
            </button>
          );
        })}
      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`flex-1 p-0 transition-opacity delay-150 duration-700 ease-out ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {renderContent()}
      </main>
    </div>
  );
};
