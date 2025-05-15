import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthUser = {
  userId: string;
  nickname: string;
};

type AuthState = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateNickname: (nickname: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (user) => set({ isLoggedIn: true, user }),
      logout: () => set({ isLoggedIn: false, user: null }),
      updateNickname: (nickname: string) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                nickname,
              }
            : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn, user: state.user }),
    },
  ),
);
