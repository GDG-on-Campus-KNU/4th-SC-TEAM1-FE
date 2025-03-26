import { LoggedIn } from './LoggedIn';
import { LoggedOut } from './LoggedOut';

const isLoggedIn = false;

export const MindTreePage = () => {
  return isLoggedIn ? <LoggedIn /> : <LoggedOut />;
};
