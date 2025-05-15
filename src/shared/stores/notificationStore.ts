// src/stores/notificationStore.ts
import { create } from 'zustand';

import { Notification } from '../apis/notificationApi';

type NotificationState = {
  list: Notification[];
  count: number;
  add: (n: Notification) => void;
  remove: (id: string) => void;
  setAll: (arr: Notification[]) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  list: [],
  count: 0,
  setAll: (notifications) => set({ list: notifications, count: notifications.length }),
  add: (notification) =>
    set((state) => ({
      list: [notification, ...state.list],
      count: state.count + 1,
    })),
  remove: (id) =>
    set((state) => {
      const updated = state.list.filter((n) => n.id !== id);
      return {
        list: updated,
        count: Math.max(0, state.count - 1),
      };
    }),
}));
