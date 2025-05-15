import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';

import { Notification, ackNotification, fetchUncheckedNotifications } from '../../apis';
import { useNotificationStore } from '../../stores';

type NotificationModalProps = {
  onClose: () => void;
};

export const NotificationModal: React.FC<NotificationModalProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { list, setAll, remove } = useNotificationStore();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const { data, isLoading, isError } = useQuery<Notification[], Error>({
    queryKey: ['notifications', 'unchecked'],
    queryFn: fetchUncheckedNotifications,
  });

  useEffect(() => {
    if (data) {
      setAll(data);
    }
  }, [data, setAll]);

  const { mutate: ackMutate } = useMutation<void, Error, string>({
    mutationFn: (notificationId: string) => {
      setDeletingIds((prev) => new Set(prev).add(notificationId));
      return ackNotification(notificationId);
    },
    onSuccess: (_data, notificationId) => {
      remove(notificationId);
      toast.success('알림이 제거되었어요');
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unchecked'] });
    },
    onSettled: (_data, _error, notificationId) => {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
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

  const formatKoreanDate = (isoString: string | null): string => {
    if (!isoString) return '알 수 없는 날짜';
    const date = new Date(isoString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const getMessage = (n: Notification): string => {
    switch (n.type) {
      case 'post':
        return `${n.senderUserId}님이 ${formatKoreanDate(n.diaryCreatedAt)}에 일기를 작성했어요.`;
      case 'comment':
        return `${n.senderUserId}님이 ${formatKoreanDate(n.diaryCreatedAt)}의 일기에 댓글을 작성했어요.`;
      case 'friend':
        return `${n.senderUserId}님이 친구 추가 요청을 보냈어요.`;
      default:
        return '새로운 알림이 도착했어요.';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[calc(100vh-200px)] w-11/12 max-w-xs overflow-y-auto rounded-lg bg-white p-6 shadow-lg sm:max-w-md">
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
                <p className="text-sm text-gray-800">{getMessage(n)}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => ackMutate(n.id)}
                disabled={deletingIds.has(n.id)}
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
