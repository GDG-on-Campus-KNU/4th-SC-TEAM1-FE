import toast from 'react-hot-toast';

import { useAuthStore } from '@shared/stores';
import axios from 'axios';

import { refreshAccessToken } from '../apis/auth';
import { BASE_URL } from '../constants/api';
import { accessToken, clearTokens } from '../utils/token';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
    _retry?: boolean;
  }
}

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = accessToken.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const message: string | undefined = error.response?.data?.message;
    const forceLogoutMessages = [
      '유효하지 않은 리프레시 토큰입니다.',
      '존재하지 않는 유저정보 입니다.',
      '리프레시 토큰이 만료되었습니다.',
    ];

    if (status === 401 && message && forceLogoutMessages.includes(message)) {
      toast.error(message || '인증 정보가 만료되었습니다.');
      clearTokens();
      useAuthStore.getState().logout();
      window.location.href = '/';
      return Promise.reject(new Error(message));
    }

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh &&
      message === '유효하지 않은 토큰입니다.'
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
