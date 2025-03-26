import { useState } from 'react';

import { Eye, EyeOff, X } from 'lucide-react';

type RegisterModalProps = {
  onClose: () => void;
  onSwitch: () => void;
};

export const RegisterModal = ({ onClose, onSwitch }: RegisterModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="relative w-full max-w-sm animate-fade-in rounded-2xl bg-white p-6 shadow-xl sm:max-w-xs">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="모달 닫기"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 제목 */}
        <h2 className="mb-6 text-center text-xl font-bold text-gray-800 sm:text-lg md:text-2xl">
          회원가입
        </h2>

        {/* 닉네임 */}
        <div className="mb-4 flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="닉네임"
              className="h-[35px] w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none sm:text-xs md:text-sm"
            />
          </div>
          <button className="h-[35px] w-[70px] rounded-lg bg-primary/40 text-xs font-extrabold text-black/40 hover:bg-primary/60">
            중복확인
          </button>
        </div>

        {/* 아이디 */}
        <div className="mb-4 flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="아이디"
              className="h-[35px] w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none sm:text-xs md:text-sm"
            />
          </div>
          <button className="h-[35px] w-[70px] rounded-lg bg-primary/40 text-xs font-extrabold text-black/40 hover:bg-primary/60">
            중복확인
          </button>
        </div>

        {/* 비밀번호 */}
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            className="h-[35px] w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm focus:border-primary focus:outline-none sm:text-xs md:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 h-[35px] -translate-y-1/2 text-gray-500 hover:text-primary"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* 비밀번호 확인 */}
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="비밀번호 확인"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm focus:border-primary focus:outline-none sm:text-xs md:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* 회원가입 버튼 */}
        <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 sm:text-xs md:text-sm">
          회원가입
        </button>

        {/* 로그인으로 전환 */}
        <p className="mt-4 text-center text-sm text-gray-500 sm:text-xs">
          이미 계정이 있으신가요?{' '}
          <button className="text-primary hover:underline" onClick={onSwitch}>
            로그인
          </button>
        </p>
      </div>
    </div>
  );
};
