// src/utils/reset.ts
import { toast } from 'react-hot-toast';

import { useAuthStore } from '../stores/authStore';
import { clearTokens } from './token';

let isResetting = false;

export const resetOnCriticalError = () => {
  if (isResetting) return;
  isResetting = true;

  clearTokens();
  useAuthStore.getState().logout();
  localStorage.clear();
  sessionStorage.clear();
  toast.error('세션이 만료되어 메인 페이지로 이동합니다.');

  setTimeout(() => {
    window.location.href = '/';
  }, 700);
};
