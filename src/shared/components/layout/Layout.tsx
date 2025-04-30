import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { initGA } from '@shared/utils';

import { AnalyticsTracker } from '../analytics';
import { AuthModal } from '../auth';
import { AppInit } from './AppInit';
import { Header } from './Header';

export const Layout = () => {
  const [modal, setModal] = useState<'login' | 'register' | null>(null);

  useEffect(() => {
    initGA();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-softGray">
      <AppInit />
      <AnalyticsTracker />
      <Header onLoginClick={() => setModal('login')} />
      <main className="flex-1">
        <Outlet />
      </main>
      <AuthModal modal={modal} setModal={setModal} />
    </div>
  );
};
