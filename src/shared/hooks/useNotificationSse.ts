import { useEffect, useRef } from 'react';

import { BASE_URL } from '@shared/constants';
import { useAuthStore } from '@shared/stores/authStore';
import { accessToken } from '@shared/utils';
import { resetOnCriticalError } from '@shared/utils';
import { EventSourcePolyfill } from 'event-source-polyfill';

import { Notification } from '../apis';
import { refreshAccessToken } from '../apis/auth';
import { useNotificationStore } from '../stores';

let isRefreshing = false;

export function useNotificationSse() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const addRef = useRef(useNotificationStore.getState().add);
  const setAll = useNotificationStore.getState().setAll;

  const esRef = useRef<EventSourcePolyfill | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    const connectSse = (token: string) => {
      if (esRef.current) {
        esRef.current.close();
      }

      const es = new EventSourcePolyfill(`${BASE_URL}/notifications/create`, {
        headers: {
          Authorization: `Bearer ${token}`,
          skipAuthRefresh: 'true',
        },
      });

      es.addEventListener('notification', (event) => {
        try {
          const data: Notification = JSON.parse((event as MessageEvent).data);
          addRef.current(data);
        } catch (e) {
          console.error('[SSE] 알림 파싱 오류:', e);
        }
      });

      es.onerror = async (e: Event) => {
        console.error('[SSE] 연결 오류 발생', e);

        const target = e.currentTarget as EventSourcePolyfill;

        const errorData = e instanceof MessageEvent ? e.data : null;

        if (
          target?.readyState === EventSourcePolyfill.CLOSED &&
          !isRefreshing &&
          errorData === '유효하지 않은 토큰입니다.'
        ) {
          isRefreshing = true;
          try {
            const newAccessToken = await refreshAccessToken();
            console.log('[SSE] 토큰 재발급 성공, 재연결 중');
            connectSse(newAccessToken);
          } catch {
            console.error('[SSE] 토큰 재발급 실패, 로그아웃 처리');
            resetOnCriticalError();
          } finally {
            isRefreshing = false;
          }
        } else {
          console.warn('[SSE] 일시적인 연결 오류 또는 리프레시 조건 불충족 – 연결 종료');
          es.close();
        }
      };

      esRef.current = es;
    };

    const token = accessToken.get();
    if (token) {
      connectSse(token);
    }

    return () => {
      esRef.current?.close();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      setAll([]);
    }
  }, [isLoggedIn, setAll]);
}
