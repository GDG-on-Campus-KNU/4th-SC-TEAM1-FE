import { axiosInstance } from '@shared/lib';
import { handleAxiosError } from '@shared/utils';

export type MyTreeStatus = {
  level: number;
  experience: number;
};

export type GrowthButtonType = 'WATER' | 'SUN' | 'NUTRIENT';

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
