import { axiosInstance } from '@shared/lib';
import { handleAxiosError } from '@shared/utils';

export type MyTreeStatus = {
  level: number;
  experience: number;
};

export type GrowthButtonType = 'WATER' | 'SUN' | 'NUTRIENT';

export type GuestbookEntry = {
  guestbookId: number;
  senderNickname: string;
  senderUserId: string;
  content: string;
  createdAt: string;
};

export const getMyTreeStatus = async (): Promise<MyTreeStatus> => {
  try {
    const res = await axiosInstance.get('/tree');
    return res.data.data as MyTreeStatus;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const growTree = async (growthButton: GrowthButtonType): Promise<void> => {
  try {
    await axiosInstance.post('/tree', { growthButton });
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const getMyGuestbookEntries = async (): Promise<GuestbookEntry[]> => {
  try {
    const response = await axiosInstance.get('/guestbook');
    // 서버가 { data: GuestbookEntry[] } 형태로 감쌌다면 response.data.data 로 꺼내세요
    return response.data.data as GuestbookEntry[];
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const deleteGuestbookEntry = async (guestbookId: number): Promise<void> => {
  try {
    await axiosInstance.delete('/guestbook', {
      data: { guestbookId },
    });
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
