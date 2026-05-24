'use client'

import { useEffect, useState } from 'react'
import { Paperclip } from 'lucide-react'
import { createPost, getUser } from '@/lib/api'
import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { getInitial } from '@/lib/format'
import type { UserSummary } from '@/lib/types'

const MAX_LENGTH = 280

export function ThreadComposer ({ onPost }: { onPost?: () => void }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<UserSummary | null>(null)

  useEffect(() => {
    let mounted = true

    Promise.resolve().then(async () => {
      const userId = getUserIdFromToken()
      if (userId.length === 0) return

      try {
        const userData = await getUser(userId)
        if (mounted) setUser(userData)
      } catch {
      }
    }).catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  async function handleSubmit () {
    const token = getAuthToken()
    if (token == null || content.trim().length === 0) return

    setLoading(true)
    try {
      await createPost(token, content.trim())
      setContent('')
      onPost?.()
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const remaining = MAX_LENGTH - content.length
  const isOverLimit = remaining < 0
  const isNearLimit = remaining <= 20 && !isOverLimit

  return (
    <section className='border-b border-border-subtle px-4 py-5 sm:px-0 sm:py-[30px]'>
      <div className='flex gap-3'>
        {user?.profileImage
          ? (
            <img
              src={user.profileImage}
              alt='내 프로필'
              className='size-9 shrink-0 rounded-full object-cover'
            />
            )
          : (
            <div className='size-9 shrink-0 rounded-full bg-neutral-600 flex items-center justify-center text-sm font-semibold text-white'>
              {getInitial(user?.username ?? '')}
            </div>
            )}

        <div className='min-w-0 flex-1'>
          <div className='flex items-center justify-between gap-4'>
            <p className='truncate text-[15px] font-semibold text-text-primary'>
              {user?.username ?? ''}
            </p>
            <button
              type='button'
              onClick={() => {
                handleSubmit().catch(() => {})
              }}
              disabled={loading || content.trim().length === 0 || isOverLimit}
              className='text-[13px] font-semibold text-primary transition-colors hover:text-sky-300 disabled:opacity-40'
            >
              {loading ? '게시 중...' : '게시'}
            </button>
          </div>

          <textarea
            className='mt-1 min-h-14 w-full resize-none bg-transparent text-[15px] leading-6 text-text-primary outline-none placeholder:text-text-muted'
            placeholder='새로운 생각을 공유해보세요...'
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />

          <div className='mt-2 flex items-center justify-between border-t border-border-subtle pt-3'>
            <button
              type='button'
              aria-label='첨부'
              disabled
              className='inline-flex size-8 items-center justify-center rounded-full text-text-muted opacity-50'
            >
              <Paperclip className='size-5' strokeWidth={1.9} aria-hidden='true' />
            </button>

            <span className={`text-[12px] tabular-nums ${
              isOverLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-text-muted'
            }`}
            >
              {remaining}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
