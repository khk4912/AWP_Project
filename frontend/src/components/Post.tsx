'use client'

import { useEffect, useRef, useState } from 'react'
import { HeartIcon, MessageCircleIcon, MoreHorizontalIcon, ShareIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import UserAvatar from './UserAvatar'
import { likePost, unlikePost } from '@/lib/api'
import { relativeTime } from '@/lib/format'
import type { Post as PostModel } from '@/lib/types'

type PostProps = {
  post: PostModel
  currentUserId?: string
  onLike?: (post: PostModel) => void
  onComment?: (post: PostModel) => void
  onShare?: (post: PostModel) => void
  onMore?: (post: PostModel) => void
  href?: string
  inDetailView?: boolean
}

function formatCount (count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toLocaleString('en-US')
}

function isLikedByCurrentUser (post: PostModel, currentUserId?: string): boolean {
  if (currentUserId == null || currentUserId.length === 0) return false

  return post.likedBy.some((user) => {
    if (typeof user === 'string') return user === currentUserId
    return user._id === currentUserId
  })
}

function ActionButton ({
  label,
  count,
  active = false,
  children,
  onClick,
  disabled = false,
}: {
  label: string
  count?: number
  active?: boolean
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type='button'
      aria-label={label}
      disabled={disabled}
      className={`group inline-flex min-w-16 items-center gap-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${active ? 'text-rose-500' : 'text-gray-500 hover:text-gray-900 rounded-full'}`}
      onClick={onClick}
    >
      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${active ? 'bg-rose-50' : 'hover:bg-gray-100'}`}>
        {children}
      </span>
      {count != null && count > 0 ? <span>{formatCount(count)}</span> : null}
    </button>
  )
}

export default function Post ({
  post,
  currentUserId,
  onLike,
  onComment,
  onShare,
  onMore,
  href,
  inDetailView = false
}: PostProps) {
  const router = useRouter()
  const commentCount = post.commentCount ?? 0
  const authorName = post.author.username
  const isOwnPost = currentUserId === post.author._id
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(() => isLikedByCurrentUser(post, currentUserId))
  const [likeCount, setLikeCount] = useState(post.likedBy.length)
  const [isLikePending, setIsLikePending] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const createdAt = new Date(post.createdAt)
  const updatedAt = post.updatedAt ? new Date(post.updatedAt) : null

  useEffect(() => {
    if (!isMenuOpen) return

    function handlePointerDown (event: PointerEvent) {
      if (menuRef.current?.contains(event.target as Node) === true) return
      setIsMenuOpen(false)
    }

    function handleKeyDown (event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  function handleLikeClick () {
    if (onLike != null) {
      onLike(post)
      return
    }

    if (currentUserId == null || currentUserId.length === 0 || isLikePending) return

    const nextLiked = !isLiked
    setIsLikePending(true)
    setIsLiked(nextLiked)
    setLikeCount((count) => count + (nextLiked ? 1 : -1))

    const request = nextLiked ? likePost(post._id) : unlikePost(post._id)
    request
      .catch(() => {
        setIsLiked(!nextLiked)
        setLikeCount((count) => count + (nextLiked ? -1 : 1))
      })
      .finally(() => setIsLikePending(false))
  }

  function handleCommentClick () {
    if (onComment != null) {
      onComment(post)
      return
    }

    if (href != null) router.push(href)
  }

  return (
    <article className='relative flex gap-3 border-b border-gray-100 px-4 py-5 transition-colors hover:bg-gray-50/50'>
      {href != null && (
        <Link
          href={href}
          aria-label='게시글 상세로 이동'
          className='absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset'
        />
      )}

      <div className='relative z-20 shrink-0'>
        <UserAvatar name={authorName} userId={post.author._id} seed={post.author._id} size={44} />
      </div>

      <div className='min-w-0 flex-1'>
        <header className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <div className='flex min-w-0 items-center gap-2'>
              <h2 className='truncate text-base font-bold text-gray-950'>{authorName}</h2>
              <span className='shrink-0 text-sm text-gray-500'>{relativeTime(post.createdAt)}</span>
            </div>
          </div>

          {isOwnPost
            ? (
              <div ref={menuRef} className='relative z-30 -mr-2 -mt-1'>
                <button
                  type='button'
                  aria-label='게시글 메뉴'
                  aria-expanded={isMenuOpen}
                  className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                  onClick={() => {
                    setIsMenuOpen((open) => !open)
                    onMore?.(post)
                  }}
                >
                  <MoreHorizontalIcon className='h-5 w-5' />
                </button>

                {isMenuOpen && (
                  <div className='absolute right-0 top-9 z-40 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg'>
                    <Link
                      href={`/post/${post._id}/edit`}
                      className='block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      수정
                    </Link>

                    <form
                      action={`/post/${post._id}/delete`}
                      method='post'
                      onSubmit={(event) => {
                        if (!window.confirm('게시글을 삭제할까요?')) {
                          event.preventDefault()
                        }
                      }}
                    >
                      <button
                        type='submit'
                        className='block w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50'
                      >
                        삭제
                      </button>
                    </form>
                  </div>
                )}
              </div>
              )
            : null}
        </header>

        <p className='mt-1 whitespace-pre-wrap leading-6 text-gray-950'>
          {post.content}
        </p>

        <footer className='relative z-20 mt-4 flex max-w-md items-center gap-4'>
          <ActionButton
            label='좋아요'
            count={likeCount}
            active={isLiked}
            disabled={isLikePending}
            onClick={handleLikeClick}
          >
            <HeartIcon className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          </ActionButton>

          <ActionButton
            label='댓글'
            count={commentCount}
            onClick={handleCommentClick}
          >
            <MessageCircleIcon className='h-5 w-5' />
          </ActionButton>

          <ActionButton
            label='공유'
            onClick={() => onShare?.(post)}
          >
            <ShareIcon className='h-5 w-5' />
          </ActionButton>
        </footer>
        {inDetailView && (
          <div className='mt-4 text-sm text-gray-500'>
            <p>{createdAt.toLocaleString()}에 작성됨</p>
            {updatedAt && <p>{updatedAt.toLocaleString()}에 수정됨</p>}
          </div>
        )}
      </div>
    </article>
  )
}
