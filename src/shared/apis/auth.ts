import toast from 'react-hot-toast';

import { resetOnCriticalError } from '@shared/utils';
import axios from 'axios';

import { axiosInstance } from '../lib/axiosInstance';
import { useAuthStore } from '../stores/authStore';
import type { LoginRequest, LoginResponse, SignupRequest, SuccessResponse } from '../types';
import { handleAxiosError } from '../utils/handleAxiosError';
import { accessToken, refreshToken as refreshTokenUtil } from '../utils/token';

export const signup = async (payload: SignupRequest): Promise<SuccessResponse> => {
  try {
    const response = await axiosInstance.post<SuccessResponse>('/members/signup', payload, {
      skipAuthRefresh: true,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/members/login', payload, {
    skipAuthRefresh: true,
  });
  return response.data;
};

export const logout = async (): Promise<void> => {
  const refresh = refreshTokenUtil.get();
  if (!refresh) {
    throw new Error('로그아웃에 필요한 토큰이 없습니다.');
  }

  try {
    await axiosInstance.post('/members/logout');
    accessToken.remove();
    refreshTokenUtil.remove();
    useAuthStore.getState().logout();
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const deleteAccount = async (): Promise<void> => {
  try {
    await axiosInstance.delete('/members/me');
    accessToken.remove();
    refreshTokenUtil.remove();
    useAuthStore.getState().logout();
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const checkUserId = async (userId: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.post(
      '/members/check-userId',
      { userId },
      {
        skipAuthRefresh: true,
      },
    );
    return response.data.data.exists;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const refreshAccessToken = async (): Promise<string> => {
  const refresh = refreshTokenUtil.get();
  const currentAccess = accessToken.get();

  if (!refresh || !currentAccess) {
    throw new Error('Access/Refresh Token이 없습니다. 다시 로그인해주세요.');
  }

  try {
    const response = await axiosInstance.post(
      '/auth/reissue',
      {
        accessToken: currentAccess,
        refreshToken: refresh,
      },
      {
        skipAuthRefresh: true, // interceptor에서 리프레시 요청 무시
      },
    );

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

    accessToken.set(newAccessToken);
    refreshTokenUtil.set(newRefreshToken);

    return newAccessToken;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response.data?.message;

      if (message === '리프레시 토큰이 만료되었습니다.') {
        resetOnCriticalError();
        return '';
      }

      if (message) {
        toast.error(message);
        return '';
      }
    }

    toast.error('토큰 재발급 중 알 수 없는 오류가 발생했습니다.');
    resetOnCriticalError();
    return '';
  }
};
