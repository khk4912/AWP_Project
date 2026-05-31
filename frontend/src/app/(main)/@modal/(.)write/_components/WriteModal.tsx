'use client'

import { useEffect } from 'react'
import { XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import PostComposer from '../../../home/_components/PostComposer'

export default function WriteModal () {
  const router = useRouter()

  function closeModal () {
    router.back()
  }

  useEffect(() => {
    function handleKeyDown (event: KeyboardEvent) {
      if (event.key === 'Escape') closeModal()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <div
      className='hidden md:fixed md:inset-0 md:z-50 md:flex
                 md:items-start md:justify-center md:bg-black/40
                 md:px-6 md:pt-20 backdrop-blur-[2px] transition-all duration-300'
      role='presentation'
      onClick={closeModal}
    >
      <div
        className='w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl'
        role='dialog'
        aria-modal='true'
        aria-labelledby='write-modal-title'
        onClick={(event) => event.stopPropagation()}
      >
        <header className='flex h-14 items-center justify-between border-b border-gray-200 px-4'>
          <button
            type='button'
            aria-label='닫기'
            className='inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 hover:text-gray-950'
            onClick={closeModal}
          >
            <XIcon className='h-5 w-5' />
          </button>
          <h2 id='write-modal-title' className='text-base font-bold text-gray-950'>글쓰기</h2>
          <span className='h-9 w-9' />
        </header>
        <PostComposer variant='modal' onCreated={closeModal} />
      </div>
    </div>
  )
}
