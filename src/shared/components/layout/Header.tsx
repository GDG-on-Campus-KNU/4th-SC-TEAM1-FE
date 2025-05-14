import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuthStore } from '@shared/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { Bell, Gem, Menu, NotebookPen, TreeDeciduous, Trees, UserRound } from 'lucide-react';

import { fetchUserPoints } from '../../apis/pointApi';
import Logo from '../../assets/todak.png';
import { PointLogModal } from './PointLogModal';

type HeaderProps = {
  onLoginClick: () => void;
};

export const Header = ({ onLoginClick }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pointLogOpen, setPointLogOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, user } = useAuthStore();

  const {
    data: userPoint = 0,
    isLoading: isPointLoading,
    isError: isPointError,
  } = useQuery<number, Error>({
    queryKey: ['points'],
    queryFn: fetchUserPoints,
    staleTime: 1000 * 60,
    enabled: isLoggedIn,
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="w-full border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between px-2 md:px-6 lg:px-12">
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="토닥 로고" className="h-6 w-auto md:h-8" />
          </Link>

          {/* 데스크탑 메뉴 */}
          <nav className="hidden items-center gap-6 md:flex">
            {isLoggedIn ? (
              <>
                {/* 포인트 (클릭 시 로그 모달) */}
                <div
                  onClick={() => setPointLogOpen(true)}
                  className="flex cursor-pointer items-center gap-1 rounded-full bg-secondary/40 px-3 py-1 text-sm font-extrabold text-gray-600"
                >
                  <Gem className="h-4 w-4 text-yellow-500" />
                  {isPointLoading ? '…' : isPointError ? 'Error' : `${userPoint} P`}
                </div>

                {/* 페이지 링크 */}
                <Link to="/" className={navClass(isActive('/'))}>
                  마음나무
                </Link>
                <Link to="/diary" className={navClass(isActive('/diary'))}>
                  일기장
                </Link>
                <Link to="/forests" className={navClass(isActive('/forests'))}>
                  이웃숲
                </Link>

                {/* 알림 */}
                <button className="relative" aria-label="알림">
                  <Bell className="h-5 w-5 text-gray-600 hover:text-primary" />
                </button>

                {/* 마이페이지 */}
                <Link
                  to="/mypage"
                  className="flex items-center gap-1 rounded-full bg-primary/40 py-1.5 pl-3 pr-4 text-xs font-medium text-black/60 transition-colors hover:bg-primary/60"
                >
                  <UserRound className="h-4 w-4" />
                  {user?.nickname ?? '마이페이지'}
                </Link>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1 rounded-full bg-primary/85 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/100"
              >
                <UserRound className="h-4 w-4" /> 로그인
              </button>
            )}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <div className="flex items-center gap-3 md:hidden">
            {isLoggedIn && (
              <div
                onClick={() => setPointLogOpen(true)}
                className="flex cursor-pointer items-center gap-1 rounded-full bg-secondary/40 px-2 py-1 text-sm font-extrabold text-gray-600"
              >
                <Gem className="h-4 w-4 text-yellow-500" />
                {isPointLoading ? '…' : isPointError ? 'Error' : `${userPoint} P`}
              </div>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="메뉴 열기"
              className="text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* 모바일 드롭다운 */}
        {menuOpen && isLoggedIn && (
          <div className="mt-2 space-y-2 divide-y divide-gray-200 border-t bg-white px-4 py-2 md:hidden">
            <button
              className="flex items-center gap-2 py-2 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              <Bell className="h-4 w-4 text-gray-600" /> 알림
            </button>
            <Link
              to="/"
              className={dropdownClass(isActive('/'))}
              onClick={() => setMenuOpen(false)}
            >
              <TreeDeciduous className="h-4 w-4" /> 마음나무
            </Link>
            <Link
              to="/diary"
              className={dropdownClass(isActive('/diary'))}
              onClick={() => setMenuOpen(false)}
            >
              <NotebookPen className="h-4 w-4" /> 일기장
            </Link>
            <Link
              to="/forests"
              className={dropdownClass(isActive('/forests'))}
              onClick={() => setMenuOpen(false)}
            >
              <Trees className="h-4 w-4" /> 이웃숲
            </Link>
            <Link
              to="/mypage"
              className={dropdownClass(isActive('/mypage'))}
              onClick={() => setMenuOpen(false)}
            >
              <UserRound className="h-4 w-4" /> {user?.nickname ?? '마이페이지'}
            </Link>
          </div>
        )}
      </header>

      {/* 포인트 로그 모달 */}
      {pointLogOpen && <PointLogModal onClose={() => setPointLogOpen(false)} />}
    </>
  );
};

const navClass = (active: boolean) =>
  `font-medium hover:text-primary ${active ? 'font-semibold text-primary' : 'text-gray-600'}`;
const dropdownClass = (active: boolean) =>
  `flex items-center gap-2 py-2 text-sm ${active ? 'font-semibold text-primary' : 'text-gray-600'}`;
