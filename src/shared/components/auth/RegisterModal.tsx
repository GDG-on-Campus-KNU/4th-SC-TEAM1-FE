import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { checkUserId, signup } from '@shared/apis';
import { Eye, EyeOff, X } from 'lucide-react';

type RegisterModalProps = {
  onClose: () => void;
  onSwitch: () => void;
};

type RegisterFormInputs = {
  nickname: string;
  userId: string;
  password: string;
  passwordCheck: string;
};

export const RegisterModal = ({ onClose, onSwitch }: RegisterModalProps) => {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    mode: 'onChange',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isUserIdChecked, setIsUserIdChecked] = useState(false);

  const checkUserIdHandler = async () => {
    const userId = getValues('userId');
    if (!userId) {
      setError('userId', { type: 'manual', message: '아이디를 입력해주세요.' });
      return;
    }

    try {
      setIsChecking(true);
      const exists = await checkUserId(userId);

      if (exists) {
        setError('userId', { type: 'manual', message: '이미 사용중인 아이디입니다.' });
        setIsUserIdChecked(false);
      } else {
        toast.success('사용 가능한 아이디입니다!');
        setIsUserIdChecked(true);
      }
    } catch {
      toast.error('아이디 중복 확인에 실패했습니다.');
      setIsUserIdChecked(false);
    } finally {
      setIsChecking(false);
    }
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    if (!isUserIdChecked) {
      toast.error('아이디 중복확인을 해주세요!');
      return;
    }

    if (data.password !== data.passwordCheck) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await signup({
        userId: data.userId,
        password: data.password,
        passwordCheck: data.passwordCheck,
        nickname: data.nickname,
      });

      toast.success('회원가입이 완료되었습니다!');
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || '회원가입에 실패했습니다.');
      } else {
        toast.error('회원가입에 실패했습니다.');
      }
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
        <h2 className="mb-6 text-center text-xl font-bold text-gray-800 sm:text-lg md:text-2xl">
          회원가입
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* 닉네임 */}
          <div>
            <input
              type="text"
              placeholder="닉네임"
              {...register('nickname', {
                minLength: {
                  value: 3,
                  message: '닉네임은 최소 3자 이상이어야 합니다.',
                },
                maxLength: {
                  value: 20,
                  message: '닉네임은 최대 20자 이하여야 합니다.',
                },
              })}
              className="h-[35px] w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none"
            />
            {errors.nickname && (
              <p className="mt-1 text-xs text-red-500">{errors.nickname.message}</p>
            )}
          </div>

          {/* 아이디 */}
          <div>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="아이디"
                  {...register('userId', {
                    required: '아이디를 입력해주세요.',
                    minLength: {
                      value: 3,
                      message: '아이디는 최소 3자 이상이어야 합니다.',
                    },
                    maxLength: {
                      value: 20,
                      message: '아이디는 최대 20자 이하여야 합니다.',
                    },
                    onChange: () => setIsUserIdChecked(false),
                  })}
                  className="h-[35px] w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none"
                />
                {errors.userId && (
                  <p className="mt-1 text-xs text-red-500">{errors.userId.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={checkUserIdHandler}
                disabled={isChecking}
                className="h-[35px] w-[70px] rounded-lg bg-primary text-xs font-extrabold text-white hover:bg-primary/80"
              >
                {isChecking ? '확인중' : '중복확인'}
              </button>
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호"
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                  minLength: {
                    value: 8,
                    message: '비밀번호는 최소 8자 이상이어야 합니다.',
                  },
                  maxLength: {
                    value: 16,
                    message: '비밀번호는 최대 16자 이하여야 합니다.',
                  },
                })}
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

          {/* 비밀번호 확인 */}
          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호 확인"
                {...register('passwordCheck', {
                  required: '비밀번호 확인을 입력해주세요.',
                })}
                className="h-[35px] w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-2 h-[20px] w-[20px] text-gray-500 transition-transform hover:scale-110 hover:text-primary"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.passwordCheck && (
              <p className="mt-1 text-xs text-red-500">{errors.passwordCheck.message}</p>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            회원가입
          </button>
        </form>

        {/* 로그인으로 전환 */}
        <p className="mt-4 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{' '}
          <button className="text-primary hover:underline" onClick={onSwitch}>
            로그인
          </button>
        </p>
      </div>
    </div>
  );
};
