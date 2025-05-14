import { axiosInstance } from '@shared/lib';
import { handleAxiosError } from '@shared/utils';

export type MyTreeStatus = {
  level: number;
  experience: number;
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
