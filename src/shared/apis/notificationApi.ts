import { axiosInstance } from '@shared/lib';
import { handleAxiosError } from '@shared/utils';

export interface Notification {
  id: string;
  objectId: number;
  senderUserId: string;
  receiverUserId: string;
  type: string;
  diaryCreatedAt: string;
  createdAt: string;
}

type ApiResponse<T> = {
  code: number;
  status: string;
  message: string;
  data: T;
};

export const fetchUncheckedNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Notification[]>>(
      '/notifications/unchecked-notifications',
    );
    return response.data.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const ackNotification = async (notificationId: string): Promise<void> => {
  try {
    await axiosInstance.post<ApiResponse<object>>('/notifications/ack', { notificationId });
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
