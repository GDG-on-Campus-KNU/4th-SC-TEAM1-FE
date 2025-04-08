import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { sendPageView } from '../../utils';

// 경로는 프로젝트 구조에 따라 조정

export const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    sendPageView(location.pathname + location.search);
  }, [location]);

  return null; // 실제 UI는 없음
};
