import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Bell, Menu, NotebookPen, TreeDeciduous, Trees, UserRound } from 'lucide-react';

import Logo from '../../assets/todak.svg';

// 임시 로그인 상태 (백엔드 연동 전)
const isLoggedIn = true;
const userName = '이지호';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full border-b bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between px-2 md:px-6 lg:px-12">
        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="토닥 로고" className="h-7 w-auto md:h-10" />
        </Link>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden items-center gap-6 md:flex">
          {isLoggedIn ? (
            <>
              <Link
                to="/"
                className={`text-lg font-medium hover:text-primary ${
                  isActive('/') ? 'font-semibold text-primary' : 'text-gray-600'
                }`}
              >
                마음나무
              </Link>
              <Link
                to="/diary"
                className={`text-lg font-medium hover:text-primary ${
                  isActive('/diary') ? 'font-semibold text-primary' : 'text-gray-600'
                }`}
              >
                일기장
              </Link>
              <Link
                to="/forests"
                className={`text-lg font-medium hover:text-primary ${
                  isActive('/forests') ? 'font-semibold text-primary' : 'text-gray-600'
                }`}
              >
                이웃숲
              </Link>
              <button className="relative" aria-label="알림">
                <Bell className="h-5 w-5 text-gray-600 hover:text-primary" />
              </button>
              <Link
                to="/mypage"
                className="flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/40"
              >
                <UserRound className="h-4 w-4" />
                {userName}
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              <UserRound className="h-4 w-4" /> 로그인
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
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              <UserRound className="h-4 w-4" /> 로그인
            </Link>
          )}
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && isLoggedIn && (
        <div className="mt-2 space-y-2 divide-y divide-gray-200 border-t bg-white px-4 py-2 md:hidden">
          <button className="flex items-center gap-2 py-2" aria-label="알림">
            <Bell className="h-4 w-4 text-gray-600" /> 알림
          </button>
          <Link
            to="/"
            className={`flex items-center gap-2 py-2 ${
              isActive('/') ? 'font-semibold text-primary' : 'text-gray-600'
            }`}
          >
            <TreeDeciduous className="h-4 w-4" /> 마음나무
          </Link>
          <Link
            to="/diary"
            className={`flex items-center gap-2 py-2 ${
              isActive('/diary') ? 'font-semibold text-primary' : 'text-gray-600'
            }`}
          >
            <NotebookPen className="h-4 w-4" /> 일기장
          </Link>
          <Link
            to="/forests"
            className={`flex items-center gap-2 py-2 ${
              isActive('/forests') ? 'font-semibold text-primary' : 'text-gray-600'
            }`}
          >
            <Trees className="h-4 w-4" /> 이웃숲
          </Link>
          <Link to="/mypage" className="flex items-center gap-2 py-2">
            <UserRound className="h-4 w-4" /> {userName}
          </Link>
        </div>
      )}
    </header>
  );
};
