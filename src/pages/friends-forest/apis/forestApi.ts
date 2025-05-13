import { axiosInstance } from '@shared/lib';
import { handleAxiosError } from '@shared/utils';

type Friend = {
  friendRequestId: number;
  friendId: string;
};

type SentFriendRequest = {
  friendRequestId: number;
  requesterName: string;
  accepterName: string;
  friendStatus: 'PENDING' | 'DECLINED';
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

export const getSentFriendRequests = async (): Promise<SentFriendRequest[]> => {
  try {
    const response = await axiosInstance.get('/friends/requester');
    return response.data.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const deleteFriendRequest = async (friendRequestId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/friends/${friendRequestId}`);
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
