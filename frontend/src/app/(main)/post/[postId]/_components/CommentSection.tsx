'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import UserAvatar from '@/components/UserAvatar'
import { createComment, deleteComment, fetchComments } from '@/lib/api'
import Comment from './Comment'
import type { Comment as CommentModel } from '@/lib/types'

type CommentSectionProps = {
  comments: CommentModel[]
  currentUserId?: string
  postId: string
}

export default function CommentSection ({ comments, currentUserId, postId }: CommentSectionProps) {
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null)
  const { data: currentComments = comments } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    initialData: comments,
  })
  const createMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      setContent('')
      queryClient.invalidateQueries({ queryKey: ['comments', postId] }).catch(() => {
        // The section keeps the existing comments if refetch fails.
      })
      queryClient.invalidateQueries({ queryKey: ['posts'] }).catch(() => {
        // Post comment counts are refreshed when the feed refetches.
      })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onMutate: (commentId) => setDeletingCommentId(commentId),
    onSettled: () => setDeletingCommentId(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] }).catch(() => {
        // The section keeps the existing comments if refetch fails.
      })
      queryClient.invalidateQueries({ queryKey: ['posts'] }).catch(() => {
        // Post comment counts are refreshed when the feed refetches.
      })
    },
  })
  const trimmedContent = content.trim()
  const isSubmitDisabled = trimmedContent.length === 0 || createMutation.isPending

  return (
    <section aria-label='댓글'>
      <h2 className='border-b border-gray-100 px-4 py-3 text-base font-bold text-gray-950'>
        댓글 {currentComments.length}
      </h2>

      <form
        className='flex gap-3 border-b border-gray-100 px-4 py-4'
        onSubmit={(event) => {
          event.preventDefault()
          if (isSubmitDisabled) return
          createMutation.mutate({ postId, content: trimmedContent })
        }}
      >
        <UserAvatar name='나' userId={currentUserId} seed={currentUserId ?? 'me'} size={40} />
        <div className='min-w-0 flex-1'>
          <textarea
            value={content}
            rows={2}
            placeholder='댓글을 작성하세요'
            className='min-h-16 w-full resize-none rounded p-2 text-[15px] leading-6 text-gray-950 outline-none focus:ring-1 focus:ring-blue-500'
            onChange={(event) => setContent(event.target.value)}
          />
          {createMutation.isError
            ? <p className='mt-1 text-sm font-medium text-red-500'>댓글 작성에 실패했습니다.</p>
            : null}
        </div>
        <button
          type='submit'
          disabled={isSubmitDisabled}
          className='h-10 shrink-0 rounded-full bg-blue-500 px-4 text-sm font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300'
        >
          {createMutation.isPending ? '작성 중' : '게시'}
        </button>
      </form>

      {currentComments.length > 0
        ? currentComments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            currentUserId={currentUserId}
            isDeleting={deletingCommentId === comment._id}
            onDelete={(target) => {
              if (window.confirm('댓글을 삭제할까요?')) {
                deleteMutation.mutate(target._id)
              }
            }}
          />
        ))
        : (
          <p className='px-4 py-8 text-center text-sm text-gray-500'>
            아직 댓글이 없습니다.
          </p>
          )}
    </section>
  )
}
