import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { login } from '@shared/apis';
import { useAuthStore } from '@shared/stores/authStore';
import { accessToken, refreshToken } from '@shared/utils/token';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Eye, EyeOff, X } from 'lucide-react';

type LoginModalProps = {
  onClose: () => void;
  onSwitch: () => void;
};

type LoginFormInputs = {
  userId: string;
  password: string;
};

export const LoginModal = ({ onClose, onSwitch }: LoginModalProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({ mode: 'onChange' });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setIsLoggingIn(true);

      const response = await login(data);
      if (!response) return;

      const { userId, nickname, accessToken: access, refreshToken: refresh } = response.data;

      accessToken.set(access);
      refreshToken.set(refresh);
      useAuthStore.getState().login({ userId, nickname });

      toast.success(`${nickname}님 환영합니다!`);
      onClose();
      queryClient.invalidateQueries({ queryKey: ['points'] });
      navigate('/');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          toast.error('등록되지 않은 계정입니다.');
        } else {
          toast.error(error.response?.data?.message || '로그인 중 오류가 발생했습니다.');
        }
      } else {
        toast.error('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

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
        <h2 className="mb-6 text-center text-xl font-bold text-gray-800">로그인</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* 아이디 */}
          <div>
            <input
              type="text"
              placeholder="아이디"
              {...register('userId', { required: '아이디를 입력해주세요.' })}
              className="h-[35px] w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none"
            />
            {errors.userId && <p className="mt-1 text-xs text-red-500">{errors.userId.message}</p>}
          </div>

          {/* 비밀번호 */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호"
                {...register('password', { required: '비밀번호를 입력해주세요.' })}
                className="h-[35px] w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 h-[20px] w-[20px] text-gray-500 transition-transform hover:scale-110 hover:text-primary"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isLoggingIn ? '잠시만 기다려주세요...' : '로그인'}
          </button>
        </form>

        {/* 회원가입 안내 */}
        <p className="mt-4 text-center text-sm text-gray-500">
          아직 계정이 없으신가요?{' '}
          <button className="text-primary hover:underline" onClick={onSwitch}>
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
};
