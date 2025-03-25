import { Routes } from '@app/routes';

import { globalStyles } from '@shared/styles';

import { Global } from '@emotion/react';

const App = () => {
  return (
    <>
      <Global styles={globalStyles} />
      <Routes />
    </>
  );
};

export default App;
