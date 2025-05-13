import { axiosInstance } from '@shared/lib';
import { handleAxiosError } from '@shared/utils';

type Friend = {
  friendRequestId: number;
  friendId: string;
};

export const getFriendList = async (): Promise<Friend[]> => {
  try {
    const response = await axiosInstance.get('/friends');
    return response.data.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const sendFriendRequest = async (friendId: string): Promise<void> => {
  try {
    await axiosInstance.post('/friends', { friendId });
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
