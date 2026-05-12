'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Send,
  Trash2,
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

type ThreadPostProps = {
  postId: string
  authorId: string
  author: string
  avatarUrl: string
  content: string
  imageUrl?: string
  likeCount: number
  likedByMe: boolean
  replyCount: string
  time: string
  verified?: boolean
}

type Comment = {
  _id: string
  author: { _id: string; username: string; profileImage: string }
  content: string
  createdAt: string
}

type ActionButtonProps = {
  label: string
  onClick?: () => void
  children: ReactNode
}

function ActionButton({ label, onClick, children }: ActionButtonProps) {
  return (
    <button
      type='button'
      aria-label={label}
      onClick={onClick}
      className='inline-flex size-8 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-white/10'
    >
      {children}
    </button>
  )
}

function VerifiedBadge() {
  return (
    <span className='inline-flex size-3.5 items-center justify-center text-primary'>
      <BadgeCheck className='size-3.5 fill-primary text-bg' strokeWidth={2.2} aria-hidden='true' />
    </span>
  )
}

function getUserIdFromToken(): string {
  try {
    const token = localStorage.getItem('token')
    if (!token) return ''
    return JSON.parse(atob(token.split('.')[1])).userId ?? ''
  } catch {
    return ''
  }
}

export function ThreadPost({
  postId,
  authorId,
  author,
  avatarUrl,
  content,
  imageUrl,
  likeCount,
  likedByMe,
  replyCount,
  time,
  verified = false,
}: ThreadPostProps) {
  const [liked, setLiked] = useState(likedByMe)
  const [count, setCount] = useState(likeCount)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentCount, setCommentCount] = useState(replyCount)
  const [commentText, setCommentText] = useState('')
  const [commentsFetched, setCommentsFetched] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleLike() {
    const token = localStorage.getItem('token')
    if (!token) return

    const endpoint = liked ? 'unlike' : 'like'
    setLiked(!liked)
    setCount(liked ? count - 1 : count + 1)

    await fetch(`${API_URL}/posts/${postId}/${endpoint}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {
      setLiked(liked)
      setCount(count)
    })
  }

  async function fetchComments() {
    const res = await fetch(`${API_URL}/comments/post/${postId}`)
    const data = await res.json()
    const list = Array.isArray(data) ? data : []
    setComments(list)
    setCommentCount(list.length.toString())
    setCommentsFetched(true)
  }

  function handleToggleComments() {
    if (!showComments && !commentsFetched) fetchComments()
    setShowComments(!showComments)
  }

  async function handleSubmitComment() {
    const token = localStorage.getItem('token')
    if (!token || !commentText.trim()) return

    setSubmitting(true)
    await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId, content: commentText.trim() }),
    })
    setCommentText('')
    await fetchComments()
    setSubmitting(false)
  }

  async function handleDeleteComment(commentId: string) {
    const token = localStorage.getItem('token')
    if (!token) return

    await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setComments(comments.filter((c) => c._id !== commentId))
  }

  return (
    <article className='relative border-b border-border-subtle px-4 py-5 sm:px-0'>
      <div className='flex gap-3'>
        <div className='flex shrink-0 flex-col items-center'>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${author} 프로필`}
              className='size-9 rounded-full object-cover'
            />
          ) : (
            <div className='size-9 rounded-full bg-neutral-600 flex items-center justify-center text-sm font-semibold text-white'>
              {author[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div className='min-w-0 flex-1'>
          <header className='flex items-center justify-between gap-4'>
            <div className='min-w-0'>
              <div className='flex items-center gap-1.5'>
                <Link href={`/profile/${authorId}`} className='truncate text-[15px] font-semibold leading-5 text-text-primary hover:underline'>
                  {author}
                </Link>
                {verified ? <VerifiedBadge /> : null}
              </div>
            </div>
            <div className='flex shrink-0 items-center gap-2 text-text-muted'>
              <time className='text-[13px]'>{time}</time>
              <button
                type='button'
                aria-label='더보기'
                className='inline-flex size-7 items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-text-primary'
              >
                <MoreHorizontal className='size-5' strokeWidth={2} aria-hidden='true' />
              </button>
            </div>
          </header>

          <p className='mt-1 whitespace-pre-line text-[15px] leading-6 text-gray-100'>
            {content}
          </p>

          {imageUrl != null ? (
            <img
              src={imageUrl}
              alt='게시글 이미지'
              className='mt-3 aspect-573/321 w-full rounded-lg border border-border-subtle object-cover'
            />
          ) : null}

          <footer className='mt-3'>
            <div className='flex items-center gap-1'>
              <ActionButton label='좋아요' onClick={handleLike}>
                <Heart
                  className='size-5'
                  strokeWidth={1.9}
                  aria-hidden='true'
                  fill={liked ? '#ef4444' : 'none'}
                  stroke={liked ? '#ef4444' : 'currentColor'}
                />
              </ActionButton>
              <ActionButton label='댓글' onClick={handleToggleComments}>
                <MessageCircle
                  className='size-5'
                  strokeWidth={1.9}
                  aria-hidden='true'
                  fill={showComments ? 'currentColor' : 'none'}
                />
              </ActionButton>
              <ActionButton label='리포스트'>
                <Repeat2 className='size-5' strokeWidth={1.9} aria-hidden='true' />
              </ActionButton>
              <ActionButton label='공유'>
                <Send className='size-5' strokeWidth={1.9} aria-hidden='true' />
              </ActionButton>
            </div>
            <p className='mt-1 text-[14px] text-text-muted'>
              답글 {commentCount}개 · 좋아요 {count}개
            </p>
          </footer>

          {/* 댓글 섹션 */}
          {showComments && (
            <div className='mt-4 border-t border-border-subtle pt-4'>
              {/* 댓글 입력 */}
              <div className='flex gap-2'>
                <textarea
                  className='flex-1 resize-none rounded-xl border border-border-subtle bg-bg-soft px-3 py-2 text-[14px] text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors'
                  placeholder='댓글을 입력하세요...'
                  rows={1}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  type='button'
                  onClick={handleSubmitComment}
                  disabled={submitting || !commentText.trim()}
                  className='shrink-0 rounded-xl bg-primary px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-40'
                >
                  게시
                </button>
              </div>

              {/* 댓글 목록 */}
              <div className='mt-3 flex flex-col gap-3'>
                {comments.length === 0 ? (
                  <p className='text-[13px] text-text-muted'>첫 댓글을 남겨보세요.</p>
                ) : (
                  comments.map((comment) => {
                    const myId = getUserIdFromToken()
                    const isMine = comment.author._id === myId
                    return (
                      <div key={comment._id} className='flex gap-2'>
                        {comment.author.profileImage ? (
                          <img
                            src={comment.author.profileImage}
                            alt={comment.author.username}
                            className='size-7 shrink-0 rounded-full object-cover'
                          />
                        ) : (
                          <div className='size-7 shrink-0 rounded-full bg-neutral-600 flex items-center justify-center text-xs font-semibold text-white'>
                            {comment.author.username[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className='flex-1'>
                          <div className='flex items-center justify-between'>
                            <span className='text-[13px] font-semibold text-text-primary'>
                              {comment.author.username}
                            </span>
                            {isMine && (
                              <button
                                type='button'
                                onClick={() => handleDeleteComment(comment._id)}
                                className='text-text-muted hover:text-red-400 transition-colors'
                                aria-label='댓글 삭제'
                              >
                                <Trash2 className='size-3.5' strokeWidth={1.9} />
                              </button>
                            )}
                          </div>
                          <p className='text-[13px] text-gray-300'>{comment.content}</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
