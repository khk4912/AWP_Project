'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BellIcon, HomeIcon, SearchIcon, UserIcon, PencilIcon } from 'lucide-react'

import GLogo from './GLogo'

type NavbarMenuProps = {
  href: string
  icon: React.ReactNode
  label: string
}
function NavbarMenu ({ href, icon, label }: NavbarMenuProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  console.log('pathname:', pathname, 'href:', href, 'isActive:', isActive)
  return (
    <Link href={href} className={`text-lg flex items-center gap-4 py-2 ${isActive ? 'text-blue-500 font-bold' : 'text-gray-700 hover:text-gray-900'}`}>
      {icon}
      {label}
    </Link>
  )
}

export default function DesktopSidebar () {
  return (
    <aside className='hidden md:flex flex-col gap-5 px-8 py-6 fixed border-r border-gray-200 h-full w-56'>
      <GLogo size={48} color='#333' />
      <div />
      <NavbarMenu href='/' icon={<HomeIcon className='h-6 w-6' />} label='홈' />
      <NavbarMenu href='/search' icon={<SearchIcon className='h-6 w-6' />} label='검색' />
      <NavbarMenu href='/notifications' icon={<BellIcon className='h-6 w-6' />} label='알림' />
      <NavbarMenu href='/write' icon={<PencilIcon className='h-6 w-6' />} label='글쓰기' />
      <NavbarMenu href='/profiles' icon={<UserIcon className='h-6 w-6' />} label='프로필' />
    </aside>
  )
}
