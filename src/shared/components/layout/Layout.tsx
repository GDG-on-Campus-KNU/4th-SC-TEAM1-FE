import { Outlet } from 'react-router-dom';

import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-softGray">
      <Header />
      <main className="flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};
