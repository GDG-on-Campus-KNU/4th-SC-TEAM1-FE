// src/stores/notificationStore.ts
import { create } from 'zustand';

import { Notification } from '../apis/notificationApi';

type NotificationState = {
  list: Notification[];
  add: (n: Notification) => void;
  remove: (id: string) => void;
  setAll: (arr: Notification[]) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  list: [],
  add: (n) =>
    set((state: NotificationState) => ({
      list: [n, ...state.list],
    })),
  remove: (id) =>
    set((state: NotificationState) => ({
      list: state.list.filter((x) => x.id !== id),
    })),
  setAll: (arr) =>
    set(() => ({
      list: arr,
    })),
}));
