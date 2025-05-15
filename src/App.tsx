import { Toaster } from 'react-hot-toast';

import { Routes } from '@app/routes';
import { ErrorPage } from '@pages/error';
import { AppErrorBoundary } from '@shared/components';
import { useNotificationSse } from '@shared/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  useNotificationSse();
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-right" reverseOrder={false} />
      <AppErrorBoundary fallback={<ErrorPage />}>
        <Routes />
      </AppErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
