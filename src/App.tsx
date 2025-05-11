import { Toaster } from 'react-hot-toast';

import { Routes } from '@app/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes />
    </QueryClientProvider>
  );
};

export default App;
