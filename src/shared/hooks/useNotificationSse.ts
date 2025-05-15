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

  // SSE 인스턴스
  const esRef = useRef<EventSourcePolyfill | null>(null);
  // 재연결 대기(ms)
  const reconnectDelay = useRef(1000);
  // 컴포넌트 언마운트 여부
  const isMounted = useRef(true);

  // SSE 연결 함수
  const connectSse = useCallback(async (token: string) => {
    // 기존 연결 닫기
    esRef.current?.close();

    const es = new EventSourcePolyfill(`${BASE_URL}/notifications/create`, {
      headers: { Authorization: `Bearer ${token}` },
      // withCredentials: true, // 쿠키 기반 인증일 때 필요
    });

    // 연결 성공 시 backoff 초기화
    es.onopen = () => {
      reconnectDelay.current = 1000;
      console.log('[SSE] 연결 성공');
    };

    // 커스텀 이벤트 수신
    es.addEventListener('notification', (ev) => {
      try {
        const data: Notification = JSON.parse((ev as MessageEvent).data);
        addRef.current(data);
      } catch (e) {
        console.error('[SSE] 파싱 오류', e);
      }
    });

    // 에러나 연결 종료 시
    es.onerror = async () => {
      console.warn(`[SSE] 연결 끊김, ${reconnectDelay.current}ms 후 재시도`);
      es.close();

      if (!isMounted.current) return;

      // 토큰 만료 같은 치명적 오류는 먼저 재발급 시도
      try {
        const newToken = await refreshAccessToken();
        accessToken.set(newToken);
        // 재연결 (재발급 성공)
        if (isMounted.current) {
          await connectSse(newToken);
        }
      } catch {
        console.error('[SSE] 토큰 재발급 실패, 로그아웃 처리');
        resetOnCriticalError();
        return;
      }

      // exponential backoff
      const delay = reconnectDelay.current;
      reconnectDelay.current = Math.min(delay * 2, 30000);

      // backoff 이후 재연결
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

  // 로그아웃 시 알림 초기화
  useEffect(() => {
    if (!isLoggedIn) {
      setAllRef.current([]);
    }
  }, [isLoggedIn]);
}
