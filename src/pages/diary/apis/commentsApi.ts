import { axiosInstance } from '@shared/lib';
import { handleAxiosError } from '@shared/utils';

export const fetchComments = async (
  diaryId: number,
  page = 0,
  size = 5,
  sort = 'createdAt,asc',
) => {
  try {
    const res = await axiosInstance.get(`/comments/${diaryId}`, {
      params: { page, size, sort },
    });
    return res.data.data;
  } catch (err) {
    handleAxiosError(err);
    throw err;
  }
};

export const createComment = async (diaryId: number, content: string) => {
  try {
    await axiosInstance.post(`/comments/${diaryId}`, { content });
  } catch (err) {
    handleAxiosError(err);
    throw err;
  }
};

export const updateComment = async (commentId: number, content: string) => {
  try {
    await axiosInstance.put(`/comments/${commentId}`, { content });
  } catch (err) {
    handleAxiosError(err);
    throw err;
  }
};

export const deleteComment = async (commentId: number) => {
  try {
    await axiosInstance.delete(`/comments/${commentId}`);
  } catch (err) {
    handleAxiosError(err);
    throw err;
  }
};

export const revealCommentAuthor = async (commentId: number): Promise<void> => {
  try {
    await axiosInstance.post(`/comments/reveal/${commentId}`);
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
