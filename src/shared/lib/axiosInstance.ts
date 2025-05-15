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

    // ✅ 조건: 401 에러면서 리프레시 시도 안 한 요청
    if (status === 401 && !originalRequest._retry && !originalRequest.skipAuthRefresh) {
      // ✅ 메시지 기반 분기 처리
      if (message === '유효하지 않은 토큰입니다.') {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshAccessToken();
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };

          return axiosInstance(originalRequest); // 요청 재시도
        } catch (refreshError) {
          // refresh 자체 실패 시 (예: 네트워크 에러)
          return Promise.reject(refreshError);
        }
      }

      if (message === '리프레시 토큰이 만료되었습니다.') {
        toast.error(message);
        clearTokens();
        useAuthStore.getState().logout();
        window.location.href = '/';
        return Promise.reject(new Error(message));
      }

      // 기타 401 에러
      toast.error(message || '인증 오류가 발생했습니다.');
      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  },
);
