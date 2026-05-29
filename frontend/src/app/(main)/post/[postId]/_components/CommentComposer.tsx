'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import UserAvatar from '@/components/UserAvatar'
import { createComment } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'

type CommentComposerProps = {
  postId: string
}

export default function CommentComposer ({ postId }: CommentComposerProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  async function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const token = getAuthToken()
    const trimmedContent = content.trim()
    if (trimmedContent.length === 0) return
    if (token == null) {
      setErrorMessage('로그인 후 댓글을 작성할 수 있습니다.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await createComment(token, postId, trimmedContent)
      setContent('')
      router.refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '댓글을 작성하지 못했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className='flex gap-3 border-b border-gray-100 px-4 py-4'
      onSubmit={(event) => {
        handleSubmit(event).catch((error: unknown) => {
          setErrorMessage(error instanceof Error ? error.message : '댓글을 작성하지 못했습니다.')
          setIsSubmitting(false)
        })
      }}
    >
      <UserAvatar name='나' seed='me' size={40} />
      <div className='min-w-0 flex-1'>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={2}
          className='block w-full resize-none rounded p-2 leading-6 outline-none focus:ring-1 focus:ring-blue-500'
          placeholder='댓글을 입력하세요'
        />
        {errorMessage.length > 0 ? <p className='mt-2 text-sm text-red-500'>{errorMessage}</p> : null}
      </div>
      <button
        type='submit'
        className='h-10 rounded-full bg-blue-500 px-4 text-sm font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300'
        disabled={content.trim().length === 0 || isSubmitting}
      >
        {isSubmitting ? '작성 중' : '댓글'}
      </button>
    </form>
  )
}
