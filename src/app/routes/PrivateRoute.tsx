// src/shared/components/PrivateRoute.tsx
import { useLocation } from 'react-router-dom';

import { ErrorPage } from '@pages/error';
import { useAuthStore } from '@shared/stores';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn && location.pathname !== '/') {
    return <ErrorPage />;
  }

  return <>{children}</>;
};
