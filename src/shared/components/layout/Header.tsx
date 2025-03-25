import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Bell, Menu, User } from 'lucide-react';

// 임시 로그인 상태 (백엔드 연동 전)
const isLoggedIn = true; // false로 바꾸면 비로그인 UI 확인 가능
const userName = '토닥이';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full border-b bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* 로고 */}
        <Link to="/" className="text-xl font-bold text-primary">
          토닥
        </Link>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden items-center gap-6 md:flex">
          {isLoggedIn ? (
            <>
              <Link to="/tree" className="hover:text-primary">
                마음나무
              </Link>
              <Link to="/diary" className="hover:text-primary">
                일기장
              </Link>
              <Link to="/forest" className="hover:text-primary">
                이웃숲
              </Link>
              <button className="relative" aria-label="알림">
                <Bell className="h-5 w-5 text-gray-600 hover:text-primary" />
              </button>
              <Link to="/mypage" className="font-semibold hover:text-primary">
                <User className="h-4 w-4" />
                {userName}
              </Link>
            </>
          ) : (
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary">
              로그인
            </Link>
          )}
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <div className="md:hidden">
          {isLoggedIn ? (
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="메뉴 열기">
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          ) : (
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary">
              로그인
            </Link>
          )}
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && isLoggedIn && (
        <div className="mt-2 space-y-2 border-t bg-white px-4 py-2 md:hidden">
          <Link to="/tree" className="block hover:text-primary">
            마음나무
          </Link>
          <Link to="/diary" className="block hover:text-primary">
            일기장
          </Link>
          <Link to="/forest" className="block hover:text-primary">
            이웃숲
          </Link>
          <Link to="/mypage" className="block hover:text-primary">
            {userName}
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
