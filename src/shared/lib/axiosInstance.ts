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

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh
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
        clearTokens();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
