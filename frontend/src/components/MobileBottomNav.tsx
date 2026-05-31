'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { HomeIcon, SearchIcon, BellIcon, UserIcon, PencilIcon } from 'lucide-react'

type NavbarMenuProps = {
  href: string
  icon: React.ReactNode
  label: string
  documentNavigation?: boolean
}
function NavbarMenu ({ href, icon, label, documentNavigation = false }: NavbarMenuProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)
  const className = `text-lg flex items-center gap-4 py-2 ${isActive ? 'text-blue-500 font-bold' : 'text-gray-700 hover:text-gray-900'}`

  if (documentNavigation) {
    return (
      <a href={href} className={className} aria-label={label}>
        {icon}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={className}
      aria-label={label}
    >

      {icon}
    </Link>
  )
}

export default function MobileBottomNav () {
  return (
    <nav className='fixed bottom-0 left-0 right-0 z-30 bg-white
                    md:hidden flex gap-4 justify-around
                    px-2 py-4
                    border-t border-gray-200'
    >
      <NavbarMenu href='/home' icon={<HomeIcon className='h-6 w-6' />} label='홈' />
      <NavbarMenu href='/search' icon={<SearchIcon className='h-6 w-6' />} label='검색' />
      <NavbarMenu href='/write' icon={<PencilIcon className='h-6 w-6' />} label='글쓰기' documentNavigation />
      <NavbarMenu href='/notifications' icon={<BellIcon className='h-6 w-6' />} label='알림' />
      <NavbarMenu href='/profile' icon={<UserIcon className='h-6 w-6' />} label='프로필' />
    </nav>
  )
}
