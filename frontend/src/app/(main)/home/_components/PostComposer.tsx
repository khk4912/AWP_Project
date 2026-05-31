'use client'

import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import UserAvatar from '@/components/UserAvatar'
import { createPost } from '@/lib/api'
import { mockCurrentUser } from '@/lib/mock'

type PostComposerProps = {
  variant?: 'feed' | 'page' | 'modal'
  onCreated?: () => void
}

const variantClassName = {
  feed: 'hidden md:flex border-b border-gray-200',
  page: 'flex border-b border-gray-200',
  modal: 'flex',
}

export const POST_CREATED_EVENT = 'post-created'

export default function PostComposer ({ variant = 'feed', onCreated }: PostComposerProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const formRef = useRef<HTMLFormElement | null>(null)
  const [content, setContent] = useState('')
  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setContent('')
      formRef.current?.reset()
      queryClient.invalidateQueries({ queryKey: ['posts'] }).catch(() => {
        // The feed also refreshes after navigation.
      })

      if (onCreated != null) {
        onCreated()
        return
      }

      if (variant === 'page') {
        router.push('/home')
        router.refresh()
      }
    },
  })

  const trimmedContent = content.trim()
  const isSubmitDisabled = trimmedContent.length === 0 || mutation.isPending

  return (
    <form
      ref={formRef}
      className={`${variantClassName[variant]} gap-4 px-4 py-3 items-start`}
      onSubmit={(event) => {
        event.preventDefault()
        if (isSubmitDisabled) return

        mutation.mutate({ content: trimmedContent })
      }}
    >
      <UserAvatar name='나' userId={mockCurrentUser._id} seed={mockCurrentUser._id} size={44} />
      <div className='min-w-0 flex-1'>
        <textarea
          name='content'
          value={content}
          className='max-h-48 min-h-10 w-full resize-none overflow-hidden rounded p-2 font-[16px] leading-6 focus:outline-none focus:ring-1 focus:ring-blue-500'
          placeholder='무슨 생각을 하고 계신가요?'
          rows={5}
          onChange={(event) => setContent(event.target.value)}
        />
        {mutation.isError
          ? <p className='mt-2 text-sm font-medium text-red-500'>게시글 작성에 실패했습니다.</p>
          : null}
      </div>
      <button
        type='submit'
        disabled={isSubmitDisabled}
        className='rounded-2xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300'
      >
        {mutation.isPending ? '게시 중...' : '게시'}
      </button>
    </form>
  )
}
