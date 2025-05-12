import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createComment,
  deleteComment,
  fetchComments,
  revealCommentAuthor,
  updateComment,
} from '../apis/commentsApi';

type CommentSectionProps = {
  diaryId: number;
};

type Comment = {
  id: number;
  createdAt: string;
  updatedAt: string;
  nickname: string;
  userId: string;
  content: string;
  isWriter: boolean;
  isAnonymous: boolean;
};

type CommentResponse = {
  content: Comment[];
  number: number;
  totalPages: number;
  last: boolean;
};

export const CommentSection = ({ diaryId }: CommentSectionProps) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [editingMap, setEditingMap] = useState<Record<number, string>>({});

  const { data, isLoading } = useQuery<
    CommentResponse,
    Error,
    CommentResponse,
    [string, number, number]
  >({
    queryKey: ['comments', diaryId, page] as const,
    queryFn: () => fetchComments(diaryId, page, 5),
  });

  const createMutation = useMutation({
    mutationFn: () => createComment(diaryId, newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', diaryId] });
      setNewComment('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) => updateComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', diaryId] });
      setEditingMap({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', diaryId] });
    },
  });

  const revealMutation = useMutation({
    mutationFn: (id: number) => revealCommentAuthor(id),
    onSuccess: () => {
      toast.success('2포인트를 사용하였습니다.');
      queryClient.invalidateQueries({ queryKey: ['comments', diaryId] });
    },
    onError: () => {
      toast.error('남은 포인트를 확인해주세요');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const sortedComments = [...(data?.content ?? [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className="mt-6 rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-primary">🌱 댓글</h3>
      <div className="space-y-4">
        {sortedComments.map((comment) => {
          const isEditing = Object.prototype.hasOwnProperty.call(editingMap, comment.id);
          return (
            <div
              key={comment.id}
              className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm"
            >
              <p className="mb-1 text-xs text-gray-500">
                <span className="font-medium text-gray-700">{comment.nickname}</span>{' '}
                <span className="text-[11px] text-gray-400">({comment.userId})</span> ·{' '}
                {new Date(comment.createdAt).toLocaleString()}
              </p>
              {isEditing ? (
                <>
                  <textarea
                    value={editingMap[comment.id]}
                    onChange={(e) =>
                      setEditingMap((prev) => ({ ...prev, [comment.id]: e.target.value }))
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="mt-2 flex gap-3 text-xs">
                    <button
                      onClick={() =>
                        updateMutation.mutate({ id: comment.id, content: editingMap[comment.id] })
                      }
                      className="rounded bg-primary px-3 py-1 text-white hover:bg-primary/90"
                    >
                      저장
                    </button>
                    <button
                      onClick={() =>
                        setEditingMap((prev) => {
                          const newMap = { ...prev };
                          delete newMap[comment.id];
                          return newMap;
                        })
                      }
                      className="text-gray-500 hover:underline"
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-sm text-gray-800">{comment.content}</p>
                  <div className="mt-2 flex gap-3 text-xs">
                    {comment.isWriter && (
                      <>
                        <button
                          onClick={() =>
                            setEditingMap((prev) => ({ ...prev, [comment.id]: comment.content }))
                          }
                          className="text-primary hover:underline"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(comment.id)}
                          className="text-red-500 hover:underline"
                        >
                          삭제
                        </button>
                      </>
                    )}
                    {comment.isAnonymous && (
                      <button
                        onClick={() => revealMutation.mutate(comment.id)}
                        className="text-blue-500 hover:underline"
                      >
                        닉네임 열람 (2P 소모)
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="hover:underline disabled:text-gray-300"
        >
          이전
        </button>
        <span>{data ? `${data.number + 1} / ${data.totalPages}` : '...'}</span>
        <button
          onClick={() => setPage((p) => (data && !data.last ? p + 1 : p))}
          disabled={!data || data.last}
          className="hover:underline disabled:text-gray-300"
        >
          다음
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newComment.trim()) createMutation.mutate();
        }}
        className="mt-6"
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="마음을 담은 댓글을 남겨보세요..."
          className="min-h-[80px] w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="mt-2 w-full rounded-lg bg-primary py-2 text-white transition hover:bg-primary/90"
        >
          댓글 작성
        </button>
      </form>
    </div>
  );
};
