'use client'

import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import Post from '@/components/Post'
import UserAvatar from '@/components/UserAvatar'
import { deleteComment, likePost, unlikePost } from '@/lib/api'
import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { likedByIncludes, relativeTime } from '@/lib/format'
import type { Comment, Post as PostModel } from '@/lib/types'

import CommentComposer from './CommentComposer'

type PostDetailClientProps = {
  post: PostModel
  comments: Comment[]
}

export default function PostDetailClient ({ post, comments }: PostDetailClientProps) {
  const [currentPost, setCurrentPost] = useState(post)
  const [errorMessage, setErrorMessage] = useState('')
  const token = getAuthToken()
  const currentUserId = getUserIdFromToken(token)
  const router = useRouter()

  async function handleLike () {
    if (token == null || currentUserId.length === 0) {
      setErrorMessage('로그인 후 좋아요를 사용할 수 있습니다.')
      return
    }

    const isLiked = likedByIncludes(currentPost, currentUserId)

    try {
      if (isLiked) {
        await unlikePost(token, currentPost._id)
      } else {
        await likePost(token, currentPost._id)
      }

      setCurrentPost((previousPost) => ({
        ...previousPost,
        likedBy: isLiked
          ? previousPost.likedBy.filter((likedBy) => {
            if (typeof likedBy === 'string') return likedBy !== currentUserId
            return likedBy._id !== currentUserId
          })
          : [...previousPost.likedBy, currentUserId],
      }))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '좋아요 상태를 변경하지 못했습니다.')
    }
  }

  async function handleDeleteComment (commentId: string) {
    if (token == null) return

    try {
      await deleteComment(token, commentId)
      router.refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '댓글을 삭제하지 못했습니다.')
    }
  }

  return (
    <>
      <Post
        post={currentPost}
        currentUserId={currentUserId}
        onLike={() => {
          handleLike().catch((error: unknown) => {
            setErrorMessage(error instanceof Error ? error.message : '좋아요 상태를 변경하지 못했습니다.')
          })
        }}
      />
      {errorMessage.length > 0
        ? <p className='border-b border-gray-100 px-4 py-3 text-sm text-red-500'>{errorMessage}</p>
        : null}
      <CommentComposer postId={currentPost._id} />

      <section>
        <h2 className='sr-only'>댓글</h2>
        {comments.length > 0
          ? comments.map((comment) => {
            const isOwnComment = currentUserId.length > 0 && comment.author._id === currentUserId

            return (
              <article key={comment._id} className='flex gap-3 border-b border-gray-100 px-4 py-4'>
                <UserAvatar name={comment.author.username} seed={comment.author._id} size={40} />
                <div className='min-w-0 flex-1'>
                  <div className='flex min-w-0 items-start justify-between gap-3'>
                    <div className='flex min-w-0 items-center gap-2'>
                      <h3 className='truncate text-sm font-bold text-gray-950'>{comment.author.username}</h3>
                      <span className='shrink-0 text-sm text-gray-500'>{relativeTime(comment.createdAt)}</span>
                    </div>
                    {isOwnComment
                      ? (
                        <button
                          type='button'
                          aria-label='댓글 삭제'
                          className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500'
                          onClick={() => {
                            handleDeleteComment(comment._id).catch((error: unknown) => {
                              setErrorMessage(error instanceof Error ? error.message : '댓글을 삭제하지 못했습니다.')
                            })
                          }}
                        >
                          <Trash2Icon className='h-4 w-4' />
                        </button>
                        )
                      : null}
                  </div>
                  <p className='mt-1 whitespace-pre-wrap break-words leading-6 text-gray-950'>
                    {comment.content}
                  </p>
                </div>
              </article>
            )
          })
          : (
            <div className='flex min-h-32 items-center justify-center px-6 text-center text-gray-500'>
              아직 댓글이 없습니다.
            </div>
            )}
      </section>
    </>
  )
}
