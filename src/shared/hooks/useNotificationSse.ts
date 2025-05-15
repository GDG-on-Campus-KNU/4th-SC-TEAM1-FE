import { useEffect } from 'react';

import { BASE_URL } from '@shared/constants';
import { useAuthStore } from '@shared/stores/authStore';
import { accessToken } from '@shared/utils';
import { EventSourcePolyfill } from 'event-source-polyfill';

import { Notification } from '../apis';
import { useNotificationStore } from '../stores';

export function useNotificationSse() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const add = useNotificationStore((s) => s.add);
  const setAll = useNotificationStore((s) => s.setAll);

  useEffect(() => {
    const token = accessToken.get();
    if (!isLoggedIn) return;

    const es = new EventSourcePolyfill(`${BASE_URL}/notifications/create`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    es.onmessage = (ev) => {
      try {
        const data: Notification = JSON.parse(ev.data);
        add(data);
      } catch {
        console.error('[SSE] parsing error');
      }
    };
    es.onerror = () => {
      console.error('[SSE] connection error');
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
