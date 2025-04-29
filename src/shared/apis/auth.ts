import axios from 'axios';

import { getRefreshToken, setAccessToken, setRefreshToken } from '../utils';
// ✅ axios 직접 import
import { axiosInstance } from './axiosInstance';

export type SignupRequest = {
  userId: string;
  password: string;
  passwordCheck: string;
  nickname: string;
};

export type SuccessResponse = {
  code: number;
  status: string;
  message: string;
  data: {
    userId: string;
  };
};

export type StackTraceItem = {
  classLoaderName: string;
  moduleName: string;
  moduleVersion: string;
  methodName: string;
  fileName: string;
  lineNumber: number;
  className: string;
  nativeMethod: boolean;
};

export type SuppressedItem = {
  stackTrace: StackTraceItem[];
  message: string;
  localizedMessage: string;
};

export type Cause = {
  stackTrace: StackTraceItem[];
  message: string;
  localizedMessage: string;
};

export type ErrorData = {
  cause?: Cause;
  stackTrace?: StackTraceItem[];
  message?: string;
  suppressed?: SuppressedItem[];
  localizedMessage?: string;
};

export type ErrorResponse = {
  code: number;
  status: string;
  message: string;
  data: ErrorData;
};

// 에러 메시지 추출 유틸
const extractErrorMessage = (errorData: ErrorResponse) => {
  return errorData.message || errorData.data?.message || '문제가 발생했습니다. 다시 시도해주세요.';
};

// 회원가입 요청
export const signup = async (payload: SignupRequest): Promise<SuccessResponse> => {
  try {
    const response = await axiosInstance.post<SuccessResponse>('/members/signup', payload);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response as { status: number; data: ErrorResponse };

      switch (status) {
        case 400:
          throw new Error(extractErrorMessage(data) || '입력값을 확인해주세요.');
        case 401:
          throw new Error(extractErrorMessage(data) || '인증이 필요합니다.');
        case 409:
          throw new Error(extractErrorMessage(data) || '이미 존재하는 아이디입니다.');
        case 500:
          throw new Error(extractErrorMessage(data) || '서버에 문제가 발생했습니다.');
        default:
          throw new Error(extractErrorMessage(data));
      }
    } else {
      throw new Error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    }
  }
};

// Refresh Token으로 Access Token 재발급
export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('Refresh Token이 없습니다. 다시 로그인해주세요.');
  }

  try {
    const response = await axiosInstance.post('/auth/refresh', {
      refreshToken: refreshToken,
    });

    const newAccessToken = response.data.data.accessToken;
    const newRefreshToken = response.data.data.refreshToken;

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);

    return newAccessToken;
  } catch {
    throw new Error('토큰 재발급에 실패했습니다. 다시 로그인해주세요.');
  }
};

// 아이디 중복확인 요청
export const checkUserId = async (userId: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.post('/members/check-userId', { userId });
    return response.data.data.exists;
  } catch {
    throw new Error('아이디 중복 확인 중 오류가 발생했습니다.');
  }
};
