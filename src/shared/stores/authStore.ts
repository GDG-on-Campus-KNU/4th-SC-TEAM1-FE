import { create } from 'zustand';

type AuthState = {
  isLoggedIn: boolean;
  userId: string | null;
  nickname: string | null;
  login: (userId: string, nickname: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userId: null,
  nickname: null,
  login: (userId, nickname) => set({ isLoggedIn: true, userId, nickname }),
  logout: () => set({ isLoggedIn: false, userId: null, nickname: null }),
}));
