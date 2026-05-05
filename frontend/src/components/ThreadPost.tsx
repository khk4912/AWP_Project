import type { ReactNode } from 'react'

type ThreadPostProps = {
  author: string
  avatarUrl: string
  content: string
  imageUrl?: string
  isLast?: boolean
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
    <span className='inline-flex size-3 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white'>
      ✓
    </span>
  )
}

function MoreIcon () {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' className='size-5' aria-hidden='true'>
      <circle cx='6' cy='12' r='1.4' />
      <circle cx='12' cy='12' r='1.4' />
      <circle cx='18' cy='12' r='1.4' />
    </svg>
  )
}

export function ThreadPost ({
  author,
  avatarUrl,
  content,
  imageUrl,
  isLast = false,
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
          {!isLast ? <div className='mt-3 w-px flex-1 bg-border-subtle' /> : null}
        </div>

        <div className='min-w-0 flex-1'>
          <header className='flex items-start justify-between gap-4'>
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
                <MoreIcon />
              </button>
            </div>
          </header>

          <p className='mt-1 whitespace-pre-line text-[15px] leading-6 text-text-primary'>
            {content}
          </p>

          {imageUrl != null ? (
            <img
              src={imageUrl}
              alt='게시글 이미지'
              className='mt-3 aspect-[573/321] w-full rounded-lg border border-border-subtle object-cover'
            />
          ) : null}

          <footer className='mt-3'>
            <div className='flex items-center gap-1'>
              <ActionButton label='좋아요'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' className='size-5' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M20.8 8.9c0 5.3-8.8 10.1-8.8 10.1S3.2 14.2 3.2 8.9A4.5 4.5 0 0 1 7.8 4.4c1.9 0 3.2 1 4.2 2.2 1-1.2 2.3-2.2 4.2-2.2a4.5 4.5 0 0 1 4.6 4.5Z' />
                </svg>
              </ActionButton>
              <ActionButton label='댓글'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' className='size-5' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M7.5 18.5h7.7c3 0 5.3-2.1 5.3-4.8s-2.3-4.8-5.3-4.8H8.8c-3 0-5.3 2.1-5.3 4.8 0 1.7.9 3.1 2.3 4v3.1l1.7-2.3Z' />
                </svg>
              </ActionButton>
              <ActionButton label='리포스트'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' className='size-5' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M17 7H8.5A3.5 3.5 0 0 0 5 10.5V11m0 0 2.4-2.4M5 11l2.4 2.4M7 17h8.5a3.5 3.5 0 0 0 3.5-3.5V13m0 0-2.4 2.4M19 13l-2.4-2.4' />
                </svg>
              </ActionButton>
              <ActionButton label='공유'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' className='size-5' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.5 12.7 15.8 8m-7.3 3.3 7.3 4.7M17.5 8.8a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6ZM17.5 19.8a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6ZM6.5 15a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z' />
                </svg>
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
