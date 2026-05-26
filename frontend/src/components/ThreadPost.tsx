'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Send,
  Trash2
} from 'lucide-react'
import { createComment, deleteComment, deletePost, getComments, likePost, unlikePost, updatePost } from '@/lib/api'
import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { getInitial } from '@/lib/format'
import type { Comment } from '@/lib/types'

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
  initialCommentsOpen?: boolean
  enableDetailLink?: boolean
  onDeleted?: (postId: string) => void
  allowEdit?: boolean
}

type ActionButtonProps = {
  label: string
  onClick?: () => void
  children: ReactNode
}

function ActionButton ({ label, onClick, children }: ActionButtonProps) {
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

function VerifiedBadge () {
  return (
    <span className='inline-flex size-3.5 items-center justify-center text-primary'>
      <BadgeCheck className='size-3.5 fill-primary text-bg' strokeWidth={2.2} aria-hidden='true' />
    </span>
  )
}

export function ThreadPost ({
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
  initialCommentsOpen = false,
  enableDetailLink = true,
  onDeleted,
  allowEdit = false
}: ThreadPostProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(likedByMe)
  const [count, setCount] = useState(likeCount)
  const [showComments, setShowComments] = useState(initialCommentsOpen)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentCount, setCommentCount] = useState(replyCount)
  const [commentText, setCommentText] = useState('')
  const commentTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [commentsFetched, setCommentsFetched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [commentError, setCommentError] = useState('')
  const [actionMenuOpen, setActionMenuOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [postError, setPostError] = useState('')
  const [postContent, setPostContent] = useState(content)
  const [draftContent, setDraftContent] = useState(content)
  const [editing, setEditing] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)

  async function handleLike () {
    const token = getAuthToken()
    if (token == null) return

    const nextLiked = !liked
    const nextCount = liked ? Math.max(0, count - 1) : count + 1
    setLiked(nextLiked)
    setCount(nextCount)

    try {
      if (liked) await unlikePost(token, postId)
      else await likePost(token, postId)
    } catch {
      setLiked(liked)
      setCount(count)
    }
  }

  const fetchComments = useCallback(async () => {
    setCommentError('')

    try {
      const list = await getComments(postId)
      setComments(list)
      setCommentCount(list.length.toString())
      setCommentsFetched(true)
    } catch {
      setCommentError('댓글을 불러오지 못했습니다.')
    }
  }, [postId])

  function handleToggleComments () {
    if (!showComments && !commentsFetched) fetchComments().catch(() => {})
    setShowComments(!showComments)
  }

  function resizeCommentTextarea () {
    const textarea = commentTextareaRef.current
    if (textarea == null) return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  function handleArticleClick (event: MouseEvent<HTMLElement>) {
    if (!enableDetailLink) return

    const target = event.target
    if (!(target instanceof Element)) return
    if (target.closest('a, button, input, textarea, select, [role="button"]') != null) return

    router.push(`/posts/${postId}`)
  }

  async function handleSubmitComment () {
    const token = getAuthToken()
    if (token == null || commentText.trim().length === 0) return

    setSubmitting(true)
    setCommentError('')

    try {
      await createComment(token, postId, commentText.trim())
      setCommentText('')
      await fetchComments()
    } catch {
      setCommentError('댓글을 게시하지 못했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteComment (commentId: string) {
    const token = getAuthToken()
    if (token == null) return

    try {
      await deleteComment(token, commentId)
      setComments((currentComments) => currentComments.filter((comment) => comment._id !== commentId))
      setCommentCount((currentCount) => Math.max(0, Number(currentCount) - 1).toString())
    } catch {
      setCommentError('댓글을 삭제하지 못했습니다.')
    }
  }

  async function handleDeletePost () {
    const token = getAuthToken()
    if (token == null || deleting) return
    if (!window.confirm('게시글을 삭제할까요?')) return

    setDeleting(true)
    setPostError('')

    try {
      await deletePost(token, postId)
      setActionMenuOpen(false)
      if (onDeleted != null) onDeleted(postId)
      else router.push('/')
    } catch {
      setPostError('게시글을 삭제하지 못했습니다.')
    } finally {
      setDeleting(false)
    }
  }

  function handleStartEdit () {
    setDraftContent(postContent)
    setPostError('')
    setActionMenuOpen(false)
    setEditing(true)
  }

  async function handleSaveEdit () {
    const token = getAuthToken()
    const nextContent = draftContent.trim()
    if (token == null || nextContent.length === 0 || savingEdit) return

    setSavingEdit(true)
    setPostError('')

    try {
      await updatePost(token, postId, { content: nextContent, imageUrl })
      setPostContent(nextContent)
      setDraftContent(nextContent)
      setEditing(false)
    } catch {
      setPostError('게시글을 수정하지 못했습니다.')
    } finally {
      setSavingEdit(false)
    }
  }

  const myId = getUserIdFromToken()
  const canManagePost = myId === authorId

  useEffect(() => {
    if (initialCommentsOpen && !commentsFetched) {
      fetchComments().catch(() => {})
    }
  }, [initialCommentsOpen, commentsFetched, fetchComments])

  useEffect(() => {
    setPostContent(content)
    setDraftContent(content)
  }, [content])

  useEffect(() => {
    resizeCommentTextarea()
  }, [commentText, showComments])

  return (
    <article
      onClick={handleArticleClick}
      className={`relative border-b border-border-subtle px-4 py-5 sm:px-4 ${
        enableDetailLink ? 'cursor-pointer transition-colors hover:bg-white/[0.03]' : ''
      }`}
    >
      <div className='flex gap-3'>
        <div className='flex shrink-0 flex-col items-center'>
          {avatarUrl.length > 0
            ? (
              <img
                src={avatarUrl}
                alt={`${author} 프로필`}
                className='size-9 rounded-full object-cover'
              />
              )
            : (
              <div className='size-9 rounded-full bg-neutral-600 flex items-center justify-center text-sm font-semibold text-white'>
                {getInitial(author)}
              </div>
              )}
        </div>

        <div className='min-w-0 flex-1 flex flex-col gap-1'>
          <header className='flex items-center justify-between gap-8'>
            <div className='min-w-0'>
              <div className='flex items-center gap-1.5'>
                <Link href={`/profile/${authorId}`} className='truncate font-semibold text-[15px] leading-5 text-text-primary hover:underline'>
                  {author}
                </Link>
                {verified ? <VerifiedBadge /> : null}
              </div>
            </div>
            <div className='flex shrink-0 items-center gap-2 text-text-muted'>
              <time className='text-[13px]'>{time}</time>
              {canManagePost
                ? (
                  <div className='relative'>
                    <button
                      type='button'
                      aria-label='더보기'
                      aria-expanded={actionMenuOpen}
                      onClick={() => setActionMenuOpen(!actionMenuOpen)}
                      className='inline-flex size-7 items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-text-primary'
                    >
                      <MoreHorizontal className='size-5' strokeWidth={2} aria-hidden='true' />
                    </button>
                    {actionMenuOpen
                      ? (
                        <div className='absolute right-0 top-8 z-20 w-32 overflow-hidden rounded-xl border border-border-subtle bg-bg-soft shadow-2xl'>
                          <button
                            type='button'
                            onClick={handleStartEdit}
                            className={`${allowEdit ? 'flex' : 'hidden'} w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-semibold text-text-primary transition-colors hover:bg-white/10`}
                          >
                            <Pencil className='size-4' strokeWidth={1.9} aria-hidden='true' />
                            수정
                          </button>
                          <button
                            type='button'
                            disabled={deleting}
                            onClick={() => {
                              handleDeletePost().catch(() => {})
                            }}
                            className='flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-semibold text-red-400 transition-colors hover:bg-white/10 disabled:opacity-50'
                          >
                            <Trash2 className='size-4' strokeWidth={1.9} aria-hidden='true' />
                            {deleting ? '삭제 중...' : '삭제'}
                          </button>
                        </div>
                        )
                      : null}
                  </div>
                  )
                : null}
            </div>
          </header>

          {editing
            ? (
              <div className='mt-4'>
                <textarea
                  className='min-h-28 w-full resize-none rounded-xl border border-border-subtle bg-bg-soft px-3 py-2 text-[15px] leading-6 text-text-primary outline-none transition-colors focus:border-primary'
                  value={draftContent}
                  onChange={(event) => setDraftContent(event.target.value)}
                />
                <div className='mt-2 flex justify-end gap-2'>
                  <button
                    type='button'
                    onClick={() => {
                      setDraftContent(postContent)
                      setEditing(false)
                      setPostError('')
                    }}
                    className='rounded-full border border-border-subtle px-4 py-2 text-[13px] font-semibold text-text-primary transition-colors hover:bg-white/5'
                  >
                    취소
                  </button>
                  <button
                    type='button'
                    disabled={savingEdit || draftContent.trim().length === 0}
                    onClick={() => {
                      handleSaveEdit().catch(() => {})
                    }}
                    className='rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-40'
                  >
                    {savingEdit ? '저장 중...' : '저장'}
                  </button>
                </div>
              </div>
              )
            : (
              <p className='mt-1 whitespace-pre-line break-words text-[15px] leading-6 text-gray-100'>
                {postContent}
              </p>
              )}

          {imageUrl != null && imageUrl.length > 0
            ? (
              <img
                src={imageUrl}
                alt='게시글 이미지'
                className='mt-3 aspect-573/321 w-full rounded-lg border border-border-subtle object-cover'
              />
              )
            : null}

          <footer className='mt-3'>
            <div className='flex items-center gap-1'>
              <ActionButton
                label='좋아요'
                onClick={() => {
                  handleLike().catch(() => {})
                }}
              >
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
            </div>
            <p className='mt-1 text-[14px] text-text-muted'>
              답글 {commentCount}개 · 좋아요 {count}개
            </p>
          </footer>
          {postError.length > 0
            ? <p className='mt-2 text-[13px] text-red-400'>{postError}</p>
            : null}

          {showComments && (
            <div className='mt-4 border-t border-border-subtle pt-4'>
              <div className='flex items-start gap-2'>
                <textarea
                  ref={commentTextareaRef}
                  className='min-w-0 flex-1 resize-none overflow-hidden rounded-xl border border-border-subtle bg-bg-soft px-3 py-2 text-[14px] text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-primary'
                  placeholder='댓글을 입력하세요...'
                  rows={1}
                  value={commentText}
                  onChange={(event) => {
                    setCommentText(event.target.value)
                    resizeCommentTextarea()
                  }}
                />
                <button
                  type='button'
                  onClick={() => {
                    handleSubmitComment().catch(() => {})
                  }}
                  disabled={submitting || commentText.trim().length === 0}
                  className='inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-opacity hover:opacity-80 disabled:opacity-40'
                  aria-label='댓글 게시'
                >
                  <Send className='size-4' strokeWidth={2} aria-hidden='true' />
                </button>
              </div>
              {commentError.length > 0
                ? <p className='mt-2 text-[13px] text-red-400'>{commentError}</p>
                : null}

              <div className='mt-3 flex flex-col gap-3'>
                {comments.length === 0
                  ? (
                    <p className='text-[13px] text-text-muted'>첫 댓글을 남겨보세요.</p>
                    )
                  : (
                      comments.map((comment) => {
                        const isMine = comment.author._id === myId
                        return (
                          <div key={comment._id} className='flex gap-2'>
                            {comment.author.profileImage.length > 0
                              ? (
                                <img
                                  src={comment.author.profileImage}
                                  alt={comment.author.username}
                                  className='size-7 shrink-0 rounded-full object-cover'
                                />
                                )
                              : (
                                <div className='size-7 shrink-0 rounded-full bg-neutral-600 flex items-center justify-center text-xs font-semibold text-white'>
                                  {getInitial(comment.author.username)}
                                </div>
                                )}
                            <div className='min-w-0 flex-1'>
                              <div className='flex items-center justify-between gap-2'>
                                <Link
                                  href={`/profile/${comment.author._id}`}
                                  className='truncate text-[13px] font-semibold text-text-primary hover:underline'
                                >
                                  {comment.author.username}
                                </Link>
                                {isMine && (
                                  <button
                                    type='button'
                                    onClick={() => {
                                      handleDeleteComment(comment._id).catch(() => {})
                                    }}
                                    className='shrink-0 text-text-muted transition-colors hover:text-red-400'
                                    aria-label='댓글 삭제'
                                  >
                                    <Trash2 className='size-3.5' strokeWidth={1.9} />
                                  </button>
                                )}
                              </div>
                              <p className='break-words text-[13px] text-gray-300'>{comment.content}</p>
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
