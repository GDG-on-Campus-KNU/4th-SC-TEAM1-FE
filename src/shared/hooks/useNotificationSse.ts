import { useEffect } from 'react';

import { BASE_URL } from '@shared/constants';
import { useAuthStore } from '@shared/stores/authStore';
import { accessToken } from '@shared/utils';
import { EventSourcePolyfill } from 'event-source-polyfill';

import { Notification } from '../apis';
import { useNotificationStore } from '../stores';

export function useNotificationSse() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const add = useNotificationStore.getState().add;
  const setAll = useNotificationStore.getState().setAll;

  useEffect(() => {
    const token = accessToken.get();
    if (!isLoggedIn || !token) return;

    const es = new EventSourcePolyfill(`${BASE_URL}/notifications/create`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    es.addEventListener('notification', (event) => {
      try {
        const data: Notification = JSON.parse((event as MessageEvent).data);
        add({ ...data });
      } catch (e) {
        console.error('[SSE] 알림 파싱 오류:', e);
      }
    });

    es.onerror = () => {
      console.error('[SSE] 연결 오류');
      es.close();
    };

    return () => {
      es.close();
    };
  }, [isLoggedIn, add]);

  useEffect(() => {
    if (!isLoggedIn) {
      setAll([]);
    }
  }, [isLoggedIn, setAll]);
}
