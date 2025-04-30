import { Toaster } from 'react-hot-toast';

import { Routes } from '@app/routes';

const App = () => {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes />
    </>
  );
};

export default App;
