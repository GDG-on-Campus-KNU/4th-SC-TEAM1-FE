import { axiosInstance } from '@shared/lib';
import { handleAxiosError } from '@shared/utils';

import type { DiaryDetail, DiarySummary } from '../types';

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

export const fetchDiaryDetail = async (diaryId: number): Promise<DiaryDetail | undefined> => {
  try {
    const response = await axiosInstance.get(`/diaries/${diaryId}`);
    return response.data.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const deleteDiary = async (diaryId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/diaries/${diaryId}`);
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const updateDiary = async (
  diaryId: number,
  payload: {
    content: string;
    emotion: 'HAPPY' | 'SAD' | 'ANGRY' | 'EXCITED' | 'NEUTRAL';
  },
): Promise<void> => {
  try {
    await axiosInstance.put(`/diaries/${diaryId}`, payload);
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const uploadImage = async (formData: FormData): Promise<{ url: string }> => {
  try {
    const response = await axiosInstance.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
