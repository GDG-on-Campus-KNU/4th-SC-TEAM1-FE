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
  }
};
