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

  setAll: (notifications) =>
    set({
      list: notifications,
      count: notifications.length,
    }),

  add: (notification) =>
    set((state) => {
      const updated = [notification, ...state.list];
      console.log('[store] 알림 추가됨', updated.length);
      return {
        list: updated,
        count: updated.length,
      };
    }),

  remove: (id) =>
    set((state) => {
      const updated = state.list.filter((n) => n.id !== id);
      return {
        list: updated,
        count: updated.length,
      };
    }),
}));
