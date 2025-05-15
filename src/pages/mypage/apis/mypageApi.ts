// src/apis/membersApi.ts
import { axiosInstance } from '@shared/lib';
import { handleAxiosError } from '@shared/utils';

export interface MemberProfile {
  userId: string;
  nickname: string;
  imageUrl: string;
}
export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  newPasswordCheck: string;
}

export const fetchMyProfile = async (): Promise<MemberProfile> => {
  try {
    const response = await axiosInstance.post('/members/me');
    return response.data.data as MemberProfile;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const updateMyNickname = async (nickname: string): Promise<void> => {
  try {
    await axiosInstance.put('/members/edit', { nickname });
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<void> => {
  try {
    await axiosInstance.put('/members/edit-password', payload);
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
