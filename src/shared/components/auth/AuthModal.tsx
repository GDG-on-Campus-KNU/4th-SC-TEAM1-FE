import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

interface AuthModalsProps {
  modal: 'login' | 'register' | null;
  setModal: React.Dispatch<React.SetStateAction<'login' | 'register' | null>>;
}

export const AuthModal = ({ modal, setModal }: AuthModalsProps) => {
  return (
    <>
      {modal === 'login' && (
        <LoginModal onClose={() => setModal(null)} onSwitch={() => setModal('register')} />
      )}
      {modal === 'register' && (
        <RegisterModal onClose={() => setModal(null)} onSwitch={() => setModal('login')} />
      )}
    </>
  );
};
