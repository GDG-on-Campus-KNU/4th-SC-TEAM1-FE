import { useEffect } from 'react';

import { refreshAccessToken } from '@shared/apis';
import { useAuthStore } from '@shared/stores/authStore';
import { refreshToken } from '@shared/utils/token';
import { clearTokens } from '@shared/utils/token';

export const AppInit = () => {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    const tryRestoreLogin = async () => {
      const refresh = refreshToken.get();
      if (!refresh) return;

      try {
        const newAccessToken = await refreshAccessToken();

        console.log('AccessToken 재발급 성공:', newAccessToken);
      } catch {
        clearTokens();
        logout();
        console.warn('토큰 재발급 실패, 로그아웃됨');
      }
    };

    tryRestoreLogin();
  }, [login, logout]);

  return null;
};
