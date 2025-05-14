import { axiosInstance } from '@shared/lib';
import { handleAxiosError } from '@shared/utils';

export type PointsResponse = {
  point: number;
};

export type PointLogEntry = {
  pointType: string;
  pointStatus: 'EARNED' | 'SPENT' | string;
  createdAt: string;
  point: number;
};

export type PointLogPage = {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  content: PointLogEntry[];
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

export const fetchPointLogs = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt,desc',
): Promise<PointLogPage> => {
  try {
    const response = await axiosInstance.get('/points/log', {
      params: { page, size, sort },
    });
    return response.data.data as PointLogPage;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
