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

let isRefreshing = false;

type FailedRequest = {
  resolve: (value: AxiosResponse<unknown> | PromiseLike<AxiosResponse<unknown>>) => void;
  reject: (error: AxiosError<unknown>) => void;
  config: AxiosRequestConfig;
};
let failedRequestsQueue: FailedRequest[] = [];

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

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<unknown>) => {
    const originalRequest = error.config as AxiosRequestConfig;

    if (originalRequest.skipAuthRefresh) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const data = (error.response?.data as { message?: string } | undefined) ?? {};
    const message = data.message ?? '';

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

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<AxiosResponse<unknown>>((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise<AxiosResponse<unknown>>((resolve, reject) => {
        refreshAccessToken()
          .then((newToken: string) => {
            accessToken.set(newToken);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            processQueue(null, newToken);

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          })
          .catch((refreshError: AxiosError<unknown>) => {
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
