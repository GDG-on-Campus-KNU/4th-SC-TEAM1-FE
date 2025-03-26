import { useState } from 'react';

import { AuthModal } from '@shared/components';

import { LoggedIn } from './LoggedIn';
import { LoggedOut } from './LoggedOut';

export const MindTreePage = () => {
  const [modal, setModal] = useState<'login' | 'register' | null>(null);
  const isLoggedIn = false;

  return (
    <>
      {isLoggedIn ? <LoggedIn /> : <LoggedOut setModal={setModal} />}
      <AuthModal modal={modal} setModal={setModal} />
    </>
  );
};
