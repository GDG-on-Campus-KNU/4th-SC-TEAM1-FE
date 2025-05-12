import { axiosInstance } from '@shared/lib';
import { handleAxiosError } from '@shared/utils';

import type { DiarySummary } from '../types';

export const fetchMonthlyDiaries = async (
  year: number,
  month: number,
): Promise<DiarySummary[] | undefined> => {
  try {
    const response = await axiosInstance.get(`/diaries/me/${year}/${month}`);
    return response.data.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const generateStorageUUID = async (): Promise<string> => {
  try {
    const response = await axiosInstance.get('/make/uuid');
    return response.data.data.uuid;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const createDiary = async (payload: {
  content: string;
  emotion: 'HAPPY' | 'SAD' | 'ANGRY' | 'EXCITED' | 'NEUTRAL';
  storageUUID: string;
}): Promise<void> => {
  try {
    await axiosInstance.post('/diaries', payload);
  } catch (error) {
    handleAxiosError(error);
  }
};
