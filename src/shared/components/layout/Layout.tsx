import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthModal } from '../auth';
import { Header } from './Header';

export const Layout = () => {
  const [modal, setModal] = useState<'login' | 'register' | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-softGray">
      <Header onLoginClick={() => setModal('login')} />
      <main className="flex-1 px-4 py-6">
        <Outlet />
      </main>
      <AuthModal modal={modal} setModal={setModal} />
    </div>
  );
};
