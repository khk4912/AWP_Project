'use client'

import { HeartIcon, MessageCircleIcon, MoreHorizontalIcon, ShareIcon } from 'lucide-react'
import Link from 'next/link'

import UserAvatar from './UserAvatar'
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
}: {
  label: string
  count?: number
  active?: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type='button'
      aria-label={label}
      className={`group inline-flex min-w-16 items-center gap-1 text-sm transition-colors  cursor-pointer ${active ? 'text-rose-500' : 'text-gray-500 hover:text-gray-900 rounded-full'}`}
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
  const isLiked = isLikedByCurrentUser(post, currentUserId)
  const likeCount = post.likedBy.length
  const commentCount = post.commentCount ?? 0
  const authorName = post.author.username

  const createdAt = new Date(post.createdAt)
  const updatedAt = post.updatedAt ? new Date(post.updatedAt) : null

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

          <button
            type='button'
            aria-label='게시글 메뉴'
            className='relative z-20 -mr-2 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700'
            onClick={() => onMore?.(post)}
          >
            <MoreHorizontalIcon className='h-5 w-5' />
          </button>
        </header>

        <p className='mt-1 whitespace-pre-wrap leading-6 text-gray-950'>
          {post.content}
        </p>

        <footer className='relative z-20 mt-4 flex max-w-md items-center gap-4'>
          <ActionButton
            label='좋아요'
            count={likeCount}
            active={isLiked}
            onClick={() => onLike?.(post)}
          >
            <HeartIcon className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          </ActionButton>

          <ActionButton
            label='댓글'
            count={commentCount}
            onClick={() => onComment?.(post)}
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
