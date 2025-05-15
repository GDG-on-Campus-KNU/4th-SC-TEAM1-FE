import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { deleteAccount, logout as logoutAPI } from '@shared/apis';
import { useAuthStore } from '@shared/stores';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, LogOut, Trash2, Upload } from 'lucide-react';

import {
  ChangePasswordPayload,
  MemberProfile,
  changePassword,
  deleteProfilePhoto,
  fetchMyProfile,
  updateMyNickname,
  uploadProfilePhoto,
} from '../apis';
import Background from '../assets/mypage-background.png';

export const Mypage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { logout: clearAuth, updateNickname: setStoreNickname } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: me,
    isLoading,
    isError,
  } = useQuery<MemberProfile, Error>({
    queryKey: ['myProfile'],
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60,
  });

  const [nicknameInput, setNicknameInput] = useState('');
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate: uploadPhoto, isPending: isUploading } = useMutation<string, Error, File>({
    mutationFn: uploadProfilePhoto,
    onSuccess: (url: string) => {
      setProfilePreview(url);
      toast.success('📸 프로필 사진이 업로드되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
  });

  const { mutate: removePhoto, isPending: isDeletingPhoto } = useMutation<void, Error, void>({
    mutationFn: deleteProfilePhoto,
    onSuccess: () => {
      setProfilePreview(null);
      toast.success('🗑️ 프로필 사진이 삭제되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
  });

  const isBusy = isLoggingOut || isDeleting || isUploading || isDeletingPhoto;

  useEffect(() => {
    if (me) {
      setNicknameInput(me.nickname);
      setProfilePreview(me.imageUrl);
    }
  }, [me]);

  const { mutate: updateNickname, isPending: isUpdating } = useMutation<
    void,
    Error,
    { nickname: string }
  >({
    mutationFn: ({ nickname }) => updateMyNickname(nickname),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      setStoreNickname(nicknameInput);
      toast.success('✨ 닉네임이 변경되었습니다!');
    },
  });

  const { mutate: submitPasswordChange, isPending: isChangingPassword } = useMutation<
    void,
    Error,
    ChangePasswordPayload
  >({
    mutationFn: (payload) => changePassword(payload),
    onSuccess: () => {
      toast.success('🔒 비밀번호가 성공적으로 변경되었습니다!');
      setOldPassword('');
      setNewPassword('');
      setNewPasswordCheck('');
    },
  });

  const onProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePreview(URL.createObjectURL(file));
    uploadPhoto(file);
  };

  const logoutUser = async () => {
    try {
      setIsLoggingOut(true);
      await logoutAPI();
      clearAuth();
      toast.success('로그아웃 되었습니다.');
      navigate('/');
    } catch {
      toast.error('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const deleteUser = async () => {
    if (!confirm('정말 탈퇴하시겠어요? 이 작업은 되돌릴 수 없습니다.')) return;
    try {
      setIsDeleting(true);
      await deleteAccount();
      clearAuth();
      toast.success('회원 탈퇴가 완료되었습니다.');
      navigate('/');
    } catch {
      toast.error('회원 탈퇴 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center bg-cover bg-no-repeat px-4 py-8"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundPosition: 'bottom center',
        }}
      >
        <div className="animate-pulse text-lg font-semibold text-white/80">로딩 중…</div>
      </div>
    );
  }
  if (isError || !me) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center bg-cover bg-no-repeat px-4 py-8"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundPosition: 'bottom center',
        }}
      >
        <span className="font-semibold text-red-500">프로필 정보를 불러오지 못했습니다.</span>
      </div>
    );
  }

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
                profilePreview
                  ? `https://www.todak.site${profilePreview}`
                  : 'https://www.todak.site/backend/images/files/default-profile-image.png'
              }
              alt="프로필 이미지"
              className="h-24 w-24 rounded-full border border-gray-300 object-cover"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
              className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-primary p-1.5 text-white hover:bg-primary/90 disabled:opacity-50"
              title="프로필 업로드"
            >
              <Upload className="h-4 w-4" />
            </button>
            <button
              onClick={() => removePhoto()}
              disabled={isBusy}
              className="absolute bottom-0 left-0 flex items-center justify-center rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600 disabled:opacity-50"
              title="프로필 삭제"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onProfileChange}
              className="hidden"
            />
          </div>
          <span className="text-xs text-gray-500">사진을 업로드하거나 삭제해 보세요</span>
        </div>

        {/* 사용자 계정 (읽기전용) */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">사용자 계정</label>
          <input
            type="text"
            value={me.userId}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-600"
          />
        </div>

        {/* 닉네임 변경 */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">닉네임</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              disabled={isBusy || isUpdating}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none disabled:bg-gray-100"
            />
            <button
              onClick={() => updateNickname({ nickname: nicknameInput })}
              disabled={isBusy || isUpdating}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating ? '저장 중…' : '저장'}
            </button>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div className="mb-6 space-y-3">
          <label className="mb-1 block text-sm font-medium text-gray-700">비밀번호 변경</label>

          {/** 현재 비밀번호 */}
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              placeholder="현재 비밀번호"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={isBusy || isChangingPassword}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowOld((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showOld ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/** 새 비밀번호 */}
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isBusy || isChangingPassword}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/** 새 비밀번호 확인 */}
          <div className="relative">
            <input
              type={showCheck ? 'text' : 'password'}
              placeholder="새 비밀번호 확인"
              value={newPasswordCheck}
              onChange={(e) => setNewPasswordCheck(e.target.value)}
              disabled={isBusy || isChangingPassword}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowCheck((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showCheck ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <button
            onClick={() =>
              submitPasswordChange({
                oldPassword,
                newPassword,
                newPasswordCheck,
              })
            }
            disabled={
              isBusy ||
              isChangingPassword ||
              newPassword !== newPasswordCheck ||
              !oldPassword ||
              !newPassword
            }
            className="mt-2 w-full rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isChangingPassword ? '변경 중…' : '비밀번호 변경'}
          </button>
        </div>

        {/* 로그아웃 & 탈퇴 */}
        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={logoutUser}
            disabled={isBusy}
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
            onClick={deleteUser}
            disabled={isBusy}
            className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? (
              <span>탈퇴 처리 중입니다...</span>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                회원 탈퇴
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
