import { useCallback, useEffect, useRef } from 'react';

import { BASE_URL } from '@shared/constants';
import { useAuthStore } from '@shared/stores/authStore';
import { accessToken } from '@shared/utils';
import { resetOnCriticalError } from '@shared/utils';
import { EventSourcePolyfill } from 'event-source-polyfill';

import { Notification } from '../apis';
import { refreshAccessToken } from '../apis/auth';
import { useNotificationStore } from '../stores';

export function useNotificationSse() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const addRef = useRef(useNotificationStore.getState().add);
  const setAllRef = useRef(useNotificationStore.getState().setAll);

  const esRef = useRef<EventSourcePolyfill | null>(null);
  const reconnectDelay = useRef(1000);
  const isMounted = useRef(true);

  const connectSse = useCallback(async (token: string) => {
    esRef.current?.close();

    const es = new EventSourcePolyfill(`${BASE_URL}/notifications/create`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    es.onopen = () => {
      reconnectDelay.current = 1000;
      console.log('[SSE] 연결 성공');
    };

    es.addEventListener('notification', (ev) => {
      try {
        const data: Notification = JSON.parse((ev as MessageEvent).data);
        addRef.current(data);
      } catch (e) {
        console.error('[SSE] 파싱 오류', e);
      }
    });

    es.onerror = async () => {
      console.warn(`[SSE] 연결 끊김, ${reconnectDelay.current}ms 후 재시도`);
      es.close();

      if (!isMounted.current) return;

      try {
        const newToken = await refreshAccessToken();
        accessToken.set(newToken);
        if (isMounted.current) {
          await connectSse(newToken);
        }
      } catch {
        console.error('[SSE] 토큰 재발급 실패, 로그아웃 처리');
        resetOnCriticalError();
        return;
      }

      const delay = reconnectDelay.current;
      reconnectDelay.current = Math.min(delay * 2, 30000);

      setTimeout(() => {
        if (isMounted.current) {
          const tokenNow = accessToken.get();
          if (tokenNow) connectSse(tokenNow);
        }
      }, delay);
    };

    esRef.current = es;
  }, []);

  useEffect(() => {
    isMounted.current = true;
    const token = accessToken.get();

    if (isLoggedIn && token) {
      connectSse(token);
    }

    return () => {
      isMounted.current = false;
      esRef.current?.close();
    };
  }, [isLoggedIn, connectSse]);

  useEffect(() => {
    if (!isLoggedIn) {
      setAllRef.current([]);
    }
  }, [isLoggedIn]);
}
