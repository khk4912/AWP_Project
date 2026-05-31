'use client'

import UserAvatar from '@/components/UserAvatar'
import { mockCurrentUser } from '@/lib/mock'

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
  return (
    <form
      className={`${variantClassName[variant]} gap-4 px-4 py-3 items-start`}
      onSubmit={(event) => event.preventDefault()}
    >
      <UserAvatar name='나' userId={mockCurrentUser._id} seed={mockCurrentUser._id} size={44} />
      <div className='min-w-0 flex-1'>
        <textarea
          className='max-h-48 min-h-10 w-full resize-none overflow-hidden rounded p-2 font-[16px] leading-6 focus:outline-none focus:ring-1 focus:ring-blue-500'
          placeholder='무슨 생각을 하고 계신가요?'
          rows={5}
        />
      </div>
      <button
        type='submit'
        className='rounded-2xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300'
      >
        게시
      </button>
    </form>
  )
}
