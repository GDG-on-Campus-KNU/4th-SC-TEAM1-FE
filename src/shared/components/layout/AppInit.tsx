import { useEffect } from 'react';

import { refreshAccessToken } from '@shared/apis';
import { useAuthStore } from '@shared/stores/authStore';
import { accessToken, clearTokens, refreshToken } from '@shared/utils/token';
import { useQuery } from '@tanstack/react-query';

import { fetchUncheckedNotifications } from '../../apis';
import { useNotificationStore } from '../../stores';

export const AppInit = () => {
  const { login, logout } = useAuthStore();
  const setAll = useNotificationStore((s) => s.setAll);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    const tryRestoreLogin = async () => {
      const refresh = refreshToken.get();
      const access = accessToken.get();

      if (access && refresh) return;

      if (!refresh) return;

      try {
        await refreshAccessToken();
      } catch {
        clearTokens();
        logout();
        console.warn('토큰 재발급 실패, 로그아웃됨');
      }
    };

    tryRestoreLogin();
  }, [login, logout]);

  const { data } = useQuery({
    queryKey: ['notifications', 'unchecked'],
    queryFn: fetchUncheckedNotifications,
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (data) {
      setAll(data);
    }
  }, [data, setAll]);

  return null;
};
