'use client'

import { useState } from 'react'
import { Paperclip } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export function ThreadComposer({ onPost }: { onPost?: () => void }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    const token = localStorage.getItem('token')
    if (!token || !content.trim()) return

    setLoading(true)
    try {
      await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: content.trim() }),
      })
      setContent('')
      onPost?.()
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='border-b border-border-subtle px-4 py-5 sm:px-0 sm:py-[30px]'>
      <div className='flex gap-3'>
        <div className='size-9 shrink-0 rounded-full bg-neutral-600 flex items-center justify-center text-sm font-semibold text-white'>
          Z
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex items-center justify-between gap-4'>
            <p className='text-[15px] font-semibold text-text-primary'>내 게시글</p>
            <button
              type='button'
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className='text-[13px] font-semibold text-primary transition-colors hover:text-sky-300 disabled:opacity-40'
            >
              {loading ? '게시 중...' : '게시'}
            </button>
          </div>

          <textarea
            className='mt-1 min-h-14 w-full resize-none bg-transparent text-[15px] leading-6 text-text-primary outline-none placeholder:text-text-muted'
            placeholder='새로운 생각을 공유해보세요...'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className='mt-2 flex items-center justify-between border-t border-border-subtle pt-3'>
            <button
              type='button'
              aria-label='첨부'
              className='inline-flex size-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary'
            >
              <Paperclip className='size-5' strokeWidth={1.9} aria-hidden='true' />
            </button>
            <p className='text-[12px] text-text-muted'>모든 사용자가 답글을 남길 수 있어요</p>
          </div>
        </div>
      </div>
    </section>
  )
}
