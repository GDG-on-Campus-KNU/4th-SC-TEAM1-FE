import { toast } from 'react-hot-toast';

import axios from 'axios';

import type { ErrorResponse } from '../types/apiTypes';

export const handleAxiosError = (error: unknown): never => {
  if (axios.isAxiosError(error) && error.response) {
    const { status, data } = error.response as { status: number; data: ErrorResponse };

    const message =
      data.message || data.data?.message || '앗! 문제가 생겼어요. 다시 시도해 주세요.';

    switch (status) {
      case 400:
        toast.error(message || '입력한 내용을 다시 한 번 확인해 주세요.');
        throw new Error(message);

      case 401:
        toast.error('로그인이 필요한 서비스예요. 로그인 후 다시 시도해 주세요.');
        throw new Error('로그인이 필요합니다.');

      case 403:
        toast.error('이 페이지에 접근할 수 있는 권한이 없어요.');
        throw new Error('권한이 없습니다.');

      case 409:
        toast.error(message || '이미 사용 중인 정보예요. 다른 값으로 시도해 주세요.');
        throw new Error(message);

      case 500:
        toast.error('서버에 문제가 생겼어요 😥 잠시 후 다시 시도해 주세요.');
        throw new Error('서버 오류가 발생했습니다.');

      default:
        toast.error(message || '문제가 발생했습니다. 다시 시도해 주세요.');
        throw new Error(message);
    }
  }

  toast.error('인터넷 연결 상태를 확인해 주세요.');
  throw new Error('네트워크 오류가 발생했습니다.');
};
