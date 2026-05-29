'use client'

import { ArrowLeftIcon, PencilIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import GLogo from './GLogo'
import UserAvatar from './UserAvatar'

function getPageTitle (pathname: string): string {
  if (pathname.startsWith('/write')) return '글쓰기'
  if (pathname.startsWith('/post')) return '게시글'
  if (pathname.startsWith('/search')) return '검색'
  if (pathname.startsWith('/notifications')) return '알림'
  if (pathname.startsWith('/profile')) return '프로필'
  return ''
}

export default function MobileTopNav () {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/home'

  if (!isHome) {
    return (
      <nav className='fixed top-0 left-0 right-0 z-10 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden'>
        <button
          type='button'
          aria-label='뒤로가기'
          className='inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-900 hover:bg-gray-100'
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className='h-5 w-5' />
        </button>
        <h1 className='text-base font-bold text-gray-950'>{getPageTitle(pathname)}</h1>
        <span className='h-8 w-8' />
      </nav>
    )
  }

  return (
    <nav className='fixed top-0 left-0 right-0 z-10 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden'>
      <UserAvatar name='나' seed='me' size={32} />
      <GLogo size={32} color='#333' />
      <button
        type='button'
        aria-label='글쓰기'
        onClick={() => window.location.assign('/write')}
      >
        <PencilIcon className='h-5 w-5' />
      </button>
    </nav>
  )
}
