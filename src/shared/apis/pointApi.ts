import { axiosInstance } from '@shared/lib';
import { handleAxiosError } from '@shared/utils';

export type PointsResponse = {
  point: number;
};

export const fetchUserPoints = async (): Promise<number> => {
  try {
    const res = await axiosInstance.get('/points');
    return (res.data.data as PointsResponse).point;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
