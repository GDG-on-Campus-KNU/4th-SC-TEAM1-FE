import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { logout as logoutAPI } from '@shared/apis';
import { useAuthStore } from '@shared/stores/authStore';
import { LogOut, Trash2, Upload } from 'lucide-react';

import Background from '../assets/mypage-background.png';

export const Mypage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuthStore(); // ✅ 상태에서 user 가져오기
  const nickname = user?.nickname ?? ''; // ✅ null-safe 닉네임 추출

  const [nicknameInput, setNicknameInput] = useState(nickname);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutAPI();
      toast.success('로그아웃 되었습니다.');
      navigate('/');
    } catch {
      toast.error('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-no-repeat px-4 py-8"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'bottom center',
      }}
    >
      <div className="w-full max-w-md animate-fade-in rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-primary">마이페이지</h2>

        {/* 프로필 이미지 */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="relative">
            <img
              src={
                profilePreview ??
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nickname)}`
              }
              alt="프로필 이미지"
              className="h-24 w-24 rounded-full border border-gray-300 object-cover"
            />
            <button
              className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-primary p-1.5 text-white hover:bg-primary/90"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoggingOut}
            >
              <Upload className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileChange}
              className="hidden"
            />
          </div>
          <span className="text-xs text-gray-500">업로드 버튼을 눌러 프로필 변경</span>
        </div>

        {/* 닉네임 변경 */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">닉네임</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              disabled={isLoggingOut}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none disabled:bg-gray-100"
            />
            <button
              disabled={isLoggingOut}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              저장
            </button>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">비밀번호 변경</label>
          <input
            type="password"
            placeholder="현재 비밀번호"
            disabled={isLoggingOut}
            className="mb-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none disabled:bg-gray-100"
          />
          <input
            type="password"
            placeholder="새 비밀번호"
            disabled={isLoggingOut}
            className="mb-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none disabled:bg-gray-100"
          />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            disabled={isLoggingOut}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none disabled:bg-gray-100"
          />
          <button
            disabled={isLoggingOut}
            className="mt-2 w-full rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            비밀번호 변경
          </button>
        </div>

        {/* 로그아웃 & 탈퇴 */}
        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoggingOut ? (
              <span>로그아웃 중입니다...</span>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                로그아웃
              </>
            )}
          </button>
          <button
            disabled={isLoggingOut}
            className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};
