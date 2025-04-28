import axios from 'axios';

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

export const signup = async (payload: SignupRequest): Promise<SuccessResponse> => {
  try {
    const response = await axios.post<SuccessResponse>('/api/v1/members/signup', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response as { status: number; data: ErrorResponse };

      switch (status) {
        case 400:
          throw new Error(data.message || data.data.message || '입력값을 확인해주세요.');
        case 401:
          throw new Error(data.message || data.data.message || '인증이 필요합니다.');
        case 409:
          throw new Error(data.message || '이미 존재하는 아이디입니다.');
        case 500:
          throw new Error(
            data.message ||
              data.data.message ||
              '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
          );
        default:
          throw new Error(data.message || '문제가 발생했습니다. 다시 시도해주세요.');
      }
    } else {
      throw new Error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    }
  }
};
