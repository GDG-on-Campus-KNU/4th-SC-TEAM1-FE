import { toast } from 'react-hot-toast';

import axios from 'axios';

import type { ErrorResponse } from '../types/apiTypes';

export const handleAxiosError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as ErrorResponse | undefined;

    const message =
      data?.message || data?.data?.message || error.message || '알 수 없는 오류가 발생했어요.';

    switch (status) {
      case 400:
        toast.error(message || '입력한 내용을 다시 한 번 확인해 주세요.');
        throw new Error(message);

      case 401:
        toast.error(message || '인증 오류가 발생했어요.');
        throw new Error(message);

      case 404:
        toast.error(message || '요청하신 페이지를 찾을 수 없어요.');
        throw new Error('리소스를 찾을 수 없습니다.');

      case 409:
        toast.error(message || '이미 사용 중인 정보예요. 다른 값으로 시도해 주세요.');
        throw new Error(message);

      case 413:
        toast.error('너무 큰 파일이에요.');
        throw new Error('요청 데이터(이미지 파일)가 서버에서 허용하는 최대 크기를 초과했습니다.');

      case 500:
        toast.error('서버에 문제가 생겼어요 😥 잠시 후 다시 시도해 주세요.');
        throw new Error('서버 오류가 발생했습니다.');

      default:
        toast.error(message || '문제가 발생했습니다. 다시 시도해 주세요.');
        throw new Error(message);
    }
  }

  const fallbackMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : JSON.stringify(error);

  toast.error(`예상치 못한 오류: ${fallbackMessage}`);
  console.error('[handleAxiosError] 비정상 오류:', error);

  throw new Error(fallbackMessage);
};
