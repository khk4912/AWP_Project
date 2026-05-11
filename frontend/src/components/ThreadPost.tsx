import type { ReactNode } from 'react'
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Send,
} from 'lucide-react'

type ThreadPostProps = {
  author: string
  avatarUrl: string
  content: string
  imageUrl?: string
  likeCount: string
  replyCount: string
  time: string
  verified?: boolean
}

type ActionButtonProps = {
  label: string
  children: ReactNode
}

function ActionButton ({ label, children }: ActionButtonProps) {
  return (
    <button
      type='button'
      aria-label={label}
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
  author,
  avatarUrl,
  content,
  imageUrl,
  likeCount,
  replyCount,
  time,
  verified = false,
}: ThreadPostProps) {
  return (
    <article className='relative border-b border-border-subtle px-4 py-5 sm:px-0'>
      <div className='flex gap-3'>
        <div className='flex shrink-0 flex-col items-center'>
          <img
            src={avatarUrl}
            alt={`${author} 프로필`}
            className='size-9 rounded-full object-cover'
          />
        </div>

        <div className='min-w-0 flex-1'>
          <header className='flex items-center justify-between gap-4'>
            <div className='min-w-0'>
              <div className='flex items-center gap-1.5'>
                <h2 className='truncate text-[15px] font-semibold leading-5 text-text-primary'>{author}</h2>
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
              <ActionButton label='좋아요'>
                <Heart className='size-5' strokeWidth={1.9} aria-hidden='true' />
              </ActionButton>
              <ActionButton label='댓글'>
                <MessageCircle className='size-5' strokeWidth={1.9} aria-hidden='true' />
              </ActionButton>
              <ActionButton label='리포스트'>
                <Repeat2 className='size-5' strokeWidth={1.9} aria-hidden='true' />
              </ActionButton>
              <ActionButton label='공유'>
                <Send className='size-5' strokeWidth={1.9} aria-hidden='true' />
              </ActionButton>
            </div>
            <p className='mt-1 text-[14px] text-text-muted'>
              답글 {replyCount}개 · 좋아요 {likeCount}개
            </p>
          </footer>
        </div>
      </div>
    </article>
  )
}
