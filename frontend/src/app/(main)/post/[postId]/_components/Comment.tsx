'use client'

import Link from 'next/link'

import UserAvatar from '@/components/UserAvatar'
import { relativeTime } from '@/lib/format'
import type { Comment as CommentModel } from '@/lib/types'

type CommentProps = {
  comment: CommentModel
}

export default function Comment ({ comment }: CommentProps) {
  const authorName = comment.author.username
  const createdAt = new Date(comment.createdAt)
  const createdAtLabel = Number.isNaN(createdAt.getTime())
    ? ''
    : createdAt.toLocaleString('ko-KR')

  return (
    <article className='flex gap-3 border-b border-gray-100 px-4 py-4'>
      <UserAvatar name={authorName} userId={comment.author._id} seed={comment.author._id} size={40} />

      <div className='min-w-0 flex-1'>
        <header className='flex min-w-0 items-center gap-2'>
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
        </header>

        <p className='mt-1 whitespace-pre-wrap break-words text-[15px] leading-6 text-gray-950'>
          {comment.content}
        </p>
      </div>
    </article>
  )
}
