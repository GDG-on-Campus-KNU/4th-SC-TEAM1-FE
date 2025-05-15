import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';

import { Notification, ackNotification, fetchUncheckedNotifications } from '../../apis';
import { useNotificationStore } from '../../stores';

interface NotificationModalProps {
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { list, setAll, remove } = useNotificationStore();

  const { data, isLoading, isError } = useQuery<Notification[], Error>({
    queryKey: ['notifications', 'unchecked'],
    queryFn: fetchUncheckedNotifications,
  });

  useEffect(() => {
    if (data) {
      setAll(data);
    }
  }, [data, setAll]);

  const { mutate: ackMutate, isPending: isAcking } = useMutation<void, Error, string>({
    mutationFn: (notificationId: string) => ackNotification(notificationId),
    onSuccess: (_data, notificationId) => {
      remove(notificationId);
      toast.success('알림이 제거되었어요');
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unchecked'] });
    },
  });

  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!document.getElementById('modal-root')) {
    const div = document.createElement('div');
    div.id = 'modal-root';
    document.body.appendChild(div);
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">알림</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {isLoading && <p className="text-center text-gray-500">로딩 중…</p>}
        {isError && <p className="text-center text-red-500">알림을 불러올 수 없습니다.</p>}

        {!isLoading && list.length === 0 && (
          <p className="text-center text-gray-500">새로운 알림이 없습니다.</p>
        )}

        <ul className="max-h-60 space-y-3 overflow-y-auto">
          {list.map((n) => (
            <li
              key={n.id}
              className="flex items-start justify-between rounded border border-gray-200 p-3"
            >
              <div className="flex-1">
                <p className="text-sm text-gray-800">{n.type}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => ackMutate(n.id)}
                disabled={isAcking}
                className="ml-4 rounded bg-red-100 px-3 py-1 text-xs text-red-600 hover:bg-red-200 disabled:opacity-50"
              >
                지우기
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.getElementById('modal-root')!,
  );
};
