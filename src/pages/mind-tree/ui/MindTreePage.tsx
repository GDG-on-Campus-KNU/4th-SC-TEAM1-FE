import { useState } from 'react';

import { AuthModal } from '@shared/components';
import { useAuthStore } from '@shared/stores/authStore';

import { LoggedIn } from './LoggedIn';
import { LoggedOut } from './LoggedOut';

export const MindTreePage = () => {
  const [modal, setModal] = useState<'login' | 'register' | null>(null);

  const { isLoggedIn } = useAuthStore();

  return (
    <>
      {isLoggedIn ? <LoggedIn /> : <LoggedOut setModal={setModal} />}
      <AuthModal modal={modal} setModal={setModal} />
    </>
  );
};
