import { axiosInstance } from '../lib/axiosInstance';
import { useAuthStore } from '../stores/authStore';
import type { LoginRequest, LoginResponse, SignupRequest, SuccessResponse } from '../types';
import { handleAxiosError } from '../utils/handleAxiosError';
import { accessToken, refreshToken as refreshTokenUtil } from '../utils/token';

export const signup = async (payload: SignupRequest): Promise<SuccessResponse> => {
  try {
    const response = await axiosInstance.post<SuccessResponse>('/members/signup', payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/members/login', payload);
  return response.data;
};

export const logout = async (): Promise<void> => {
  const refresh = refreshTokenUtil.get();
  if (!refresh) {
    throw new Error('로그아웃에 필요한 토큰이 없습니다.');
  }

  try {
    await axiosInstance.post('/members/logout', { refreshToken: refresh });
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
    const response = await axiosInstance.post('/members/check-userId', { userId });
    return response.data.data.exists;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const refreshAccessToken = async (): Promise<string> => {
  const refresh = refreshTokenUtil.get();
  if (!refresh) {
    throw new Error('Refresh Token이 없습니다. 다시 로그인해주세요.');
  }

  try {
    const response = await axiosInstance.post('/auth/refresh', { refreshToken: refresh });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

    accessToken.set(newAccessToken);
    refreshTokenUtil.set(newRefreshToken);

    return newAccessToken;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
