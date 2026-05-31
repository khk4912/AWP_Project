'use client'

import { TrashIcon } from 'lucide-react'
import Link from 'next/link'

import UserAvatar from '@/components/UserAvatar'
import { relativeTime } from '@/lib/format'
import type { Comment as CommentModel } from '@/lib/types'

type CommentProps = {
  comment: CommentModel
  currentUserId?: string
  isDeleting?: boolean
  onDelete?: (comment: CommentModel) => void
}

export default function Comment ({ comment, currentUserId, isDeleting = false, onDelete }: CommentProps) {
  const authorName = comment.author.username
  const isOwnComment = currentUserId === comment.author._id
  const createdAt = new Date(comment.createdAt)
  const createdAtLabel = Number.isNaN(createdAt.getTime())
    ? ''
    : createdAt.toLocaleString('ko-KR')

  return (
    <article className='flex gap-3 border-b border-gray-100 px-4 py-4'>
      <UserAvatar name={authorName} userId={comment.author._id} seed={comment.author._id} size={40} />

      <div className='min-w-0 flex-1'>
        <header className='flex min-w-0 items-start justify-between gap-3'>
          <div className='flex min-w-0 items-center gap-2'>
            <Link
              href={`/profile/${comment.author._id}`}
              className='truncate text-sm font-bold text-gray-950 hover:underline'
            >
              {authorName}
            </Link>
            <time
              dateTime={comment.createdAt}
              title={createdAtLabel}
              className='shrink-0 text-sm text-gray-500'
            >
              {relativeTime(comment.createdAt)}
            </time>
          </div>

          {isOwnComment
            ? (
              <button
                type='button'
                aria-label='댓글 삭제'
                disabled={isDeleting}
                className='-mr-2 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60'
                onClick={() => onDelete?.(comment)}
              >
                <TrashIcon className='h-4 w-4' />
              </button>
              )
            : null}
        </header>

        <p className='mt-1 whitespace-pre-wrap break-words text-[15px] leading-6 text-gray-950'>
          {comment.content}
        </p>
      </div>
    </article>
  )
}
