'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BellIcon, HomeIcon, SearchIcon, UserIcon, PencilIcon } from 'lucide-react'

import type { UserProfile } from '@/lib/types'

import GLogo from './GLogo'
import LogoutButton from './LogoutButton'
import ThemeToggle from './ThemeToggle'
import UserAvatar from './UserAvatar'

type NavbarMenuProps = {
  href: string
  icon: React.ReactNode
  label: string
}
function NavbarMenu ({ href, icon, label }: NavbarMenuProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)
  return (
    <Link
      href={href}
      className={`text-lg flex items-center gap-4 py-2 ml-[-12]
                 ${isActive ? 'text-blue-500 font-bold bg-gray-100' : 'text-gray-700 hover:text-gray-900'}
                  rounded-full transition-colors duration-200 hover:bg-gray-100 px-4`}
    >
      {icon}
      {label}
    </Link>
  )
}

type AccountMenuProps = {
  name: string
  username: string
  userId: string
}

function AccountMenu ({ name, username, userId }: AccountMenuProps) {
  return (
    <Link href='/profile' className='flex items-center gap-4 text-gray-700 hover:text-gray-900'>
      <UserAvatar name={name} userId={userId} seed={userId} size={40} noHref />
      <span className='min-w-0'>
        <span className='block truncate font-medium'>{name}</span>
        <span className='block truncate text-sm text-gray-500'>{username}</span>
      </span>
    </Link>
  )
}

export default function DesktopSidebar ({ currentUser }: { currentUser: UserProfile | null }) {
  return (
    <aside className='sticky top-0 hidden h-screen w-56 shrink-0 flex-col gap-5 border-r border-gray-200 px-8 py-6 md:flex'>
      <GLogo size={48} />
      <div id='spacer' />
      <NavbarMenu href='/home' icon={<HomeIcon className='h-6 w-6' />} label='홈' />
      <NavbarMenu href='/search' icon={<SearchIcon className='h-6 w-6' />} label='검색' />
      <NavbarMenu href='/notifications' icon={<BellIcon className='h-6 w-6' />} label='알림' />
      <NavbarMenu href='/write' icon={<PencilIcon className='h-6 w-6' />} label='글쓰기' />
      <NavbarMenu href='/profile' icon={<UserIcon className='h-6 w-6' />} label='프로필' />

      <div className='mt-auto flex flex-col gap-3 pt-4'>
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          {currentUser != null
            ? (
              <LogoutButton
                title='로그아웃'
                className='inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              />
              )
            : null}
        </div>
        {currentUser != null
          ? (
            <AccountMenu
              name={currentUser.username}
              username={currentUser.email ?? 'you'}
              userId={currentUser._id}
            />
            )
          : null}
      </div>
    </aside>
  )
}
