import toast from 'react-hot-toast';

import { useAuthStore } from '@shared/stores';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

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

// 재발급 중인지 표시
let isRefreshing = false;

// 재시도 대기열에 쌓일 요청 타입
type FailedRequest = {
  resolve: (value: AxiosResponse<unknown> | PromiseLike<AxiosResponse<unknown>>) => void;
  reject: (error: AxiosError<unknown>) => void;
  config: AxiosRequestConfig;
};
let failedRequestsQueue: FailedRequest[] = [];

// 대기열 처리
const processQueue = (error: AxiosError<unknown> | null, token: string | null = null): void => {
  failedRequestsQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      config.headers = config.headers ?? {};
      config.headers['Authorization'] = `Bearer ${token}`;
      resolve(axiosInstance(config));
    }
  });
  failedRequestsQueue = [];
};

// — Request Interceptor —
//  • 기본 토큰 부착
//  • `/auth/refresh` 호출 시에는 skipAuthRefresh 플래그를 달아 재귀 방지
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url?.includes('/auth/refresh')) {
      config.skipAuthRefresh = true;
    }
    const token = accessToken.get();
    if (token && !config.skipAuthRefresh) {
      config.headers = config.headers ?? {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError<unknown>) => Promise.reject(error),
);

// — Response Interceptor —
//  • 401 에러 → 토큰 재발급 → 대기열 요청 재시도
//  • 리프레시 토큰 오류 메시지에 해당하면 강제 로그아웃
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<unknown>) => {
    const originalRequest = error.config as AxiosRequestConfig;

    // 리프레시 자체 호출이면 그대로 reject
    if (originalRequest.skipAuthRefresh) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    // 안전하게 message 꺼내기
    const data = (error.response?.data as { message?: string } | undefined) ?? {};
    const message = data.message ?? '';

    // 리프레시 토큰 관련 오류 → 강제 로그아웃
    const forceLogoutKeywords = [
      '유효하지 않은 리프레시 토큰입니다.',
      '존재하지 않는 유저정보 입니다.',
      '리프레시 토큰이 만료되었습니다.',
    ];
    if (status === 401 && forceLogoutKeywords.some((keyword) => message.includes(keyword))) {
      toast.error('세션이 유효하지 않습니다. 다시 로그인해주세요.');
      clearTokens();
      useAuthStore.getState().logout();
      window.location.href = '/';
      return Promise.reject(error);
    }

    // 액세스토큰 만료(401) → 재시도 로직
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 재발급 중이면 대기열에 추가
        return new Promise<AxiosResponse<unknown>>((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise<AxiosResponse<unknown>>((resolve, reject) => {
        refreshAccessToken()
          .then((newToken: string) => {
            // 토큰 저장 및 기본 헤더 갱신
            accessToken.set(newToken);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            // 대기열 재시도
            processQueue(null, newToken);

            // 원래 요청에도 새 토큰 달아 재요청
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          })
          .catch((refreshError: AxiosError<unknown>) => {
            // 재발급 실패 시 모두 실패 처리 후 로그아웃
            processQueue(refreshError, null);
            toast.error('세션이 만료되어 로그인 화면으로 이동합니다.');
            clearTokens();
            useAuthStore.getState().logout();
            window.location.href = '/';
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
