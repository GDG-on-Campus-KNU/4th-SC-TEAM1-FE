import { useEffect } from 'react';

import { refreshAccessToken } from '@shared/apis';
import { useAuthStore } from '@shared/stores/authStore';
import { clearTokens, refreshToken } from '@shared/utils/token';

export const AppInit = () => {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    const tryRestoreLogin = async () => {
      const refresh = refreshToken.get();
      if (!refresh) return;

      try {
        await refreshAccessToken();
        // console.log('AccessToken 재발급 성공:', newAccessToken); // 필요 없다면 제거
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
