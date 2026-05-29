'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import UserAvatar from '@/components/UserAvatar'
import { createPost } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'

type PostComposerProps = {
  variant?: 'feed' | 'page' | 'modal'
}

const variantClassName = {
  feed: 'hidden md:flex border-b border-gray-200',
  page: 'flex border-b border-gray-200',
  modal: 'flex',
}

export const POST_CREATED_EVENT = 'post-created'

export default function PostComposer ({ variant = 'feed' }: PostComposerProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (textarea == null) return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [content])

  async function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedContent = content.trim()
    const token = getAuthToken()
    if (trimmedContent.length === 0) return
    if (token == null) {
      setErrorMessage('로그인 후 게시글을 작성할 수 있습니다.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await createPost(token, trimmedContent)
      setContent('')
      window.dispatchEvent(new Event(POST_CREATED_EVENT))
      if (variant !== 'feed') router.push('/home')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '게시글을 작성하지 못했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className={`${variantClassName[variant]} gap-4 px-4 py-3 items-start`}
      onSubmit={(event) => {
        handleSubmit(event).catch((error: unknown) => {
          setErrorMessage(error instanceof Error ? error.message : '게시글을 작성하지 못했습니다.')
          setIsSubmitting(false)
        })
      }}
    >
      <UserAvatar name='나' seed='me' size={44} />
      <div className='min-w-0 flex-1'>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className='max-h-48 min-h-10 w-full resize-none overflow-hidden rounded p-2 font-[16px] leading-6 focus:outline-none focus:ring-1 focus:ring-blue-500'
          placeholder='무슨 생각을 하고 계신가요?'
          rows={5}
        />
        {errorMessage.length > 0 ? <p className='mt-2 text-sm text-red-500'>{errorMessage}</p> : null}
      </div>
      <button
        type='submit'
        className='rounded-2xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300'
        disabled={content.trim().length === 0 || isSubmitting}
      >
        {isSubmitting ? '게시 중' : '게시'}
      </button>
    </form>
  )
}
