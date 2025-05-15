import { useState } from 'react';

import { Bell } from 'lucide-react';

import { useNotificationStore } from '../../stores';
import { NotificationModal } from './NotificationModal';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const list = useNotificationStore((s) => s.list);
  const count = list.length;

  return (
    <>
      <button onClick={() => setOpen((v) => !v)} className="relative">
        <Bell className="h-6 w-6 sm:h-5 sm:w-5" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {count}
          </span>
        )}
      </button>
      {open && <NotificationModal onClose={() => setOpen(false)} />}
    </>
  );
}
