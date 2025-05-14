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

type ReceivedFriendRequest = SentFriendRequest;

export type FriendRequestCount = {
  friendStatus: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  info: string;
  count: number;
};

export type FriendTreeStatus = {
  level: number;
  experience: number;
};

export type GuestbookPayload = {
  userId: string;
  content: string;
};

export type GuestbookEntry = {
  guestbookId: number;
  senderNickname: string;
  senderUserId: string;
  content: string;
  createdAt: string;
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

export const getReceivedFriendRequests = async (): Promise<ReceivedFriendRequest[]> => {
  try {
    const response = await axiosInstance.get('/friends/accepter');
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

export const acceptFriendRequest = async (friendRequestId: number): Promise<void> => {
  try {
    await axiosInstance.put(`/friends/accept/${friendRequestId}`);
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const declineFriendRequest = async (friendRequestId: number): Promise<void> => {
  try {
    await axiosInstance.put(`/friends/decline/${friendRequestId}`);
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const getFriendRequestCounts = async (): Promise<FriendRequestCount[]> => {
  try {
    const response = await axiosInstance.get('/friends/count');
    return response.data.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const getFriendTreeStatus = async (friendId: string): Promise<FriendTreeStatus> => {
  try {
    const response = await axiosInstance.get(`/tree/${friendId}`);
    return response.data.data as FriendTreeStatus;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const createGuestbookEntry = async (payload: GuestbookPayload): Promise<void> => {
  try {
    await axiosInstance.post('/guestbook', payload);
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const getGuestbookEntries = async (): Promise<GuestbookEntry[]> => {
  try {
    const response = await axiosInstance.get('/guestbook');
    return response.data.data as GuestbookEntry[];
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
