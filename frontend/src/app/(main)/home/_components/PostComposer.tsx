'use client'

import { useLayoutEffect, useRef, useState } from 'react'

import UserAvatar from '@/components/UserAvatar'

type PostComposerProps = {
  variant?: 'feed' | 'page' | 'modal'
}

const variantClassName = {
  feed: 'hidden md:flex border-b border-gray-200',
  page: 'flex border-b border-gray-200',
  modal: 'flex',
}

export default function PostComposer ({ variant = 'feed' }: PostComposerProps) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (textarea == null) return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [content])

  return (
    <div className={`${variantClassName[variant]} gap-4 px-4 py-3 items-start`}>
      <UserAvatar name='나' seed='me' size={44} />
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        className='max-h-48 min-h-10 flex-1 resize-none overflow-hidden rounded p-2 leading-6 focus:outline-none focus:ring-1 focus:ring-blue-500 font-[16px]'
        placeholder='무슨 생각을 하고 계신가요?'
        rows={5}
      />
      <button className=' px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed' disabled={content.trim().length === 0}>
        게시
      </button>
    </div>
  )
}
