'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Bookmark,
  CircleUserRound,
  Home,
  MessageCircle,
  Search,
  type LucideIcon,
} from 'lucide-react'
import { usePathname } from 'next/navigation'

import zIconSrc from '@assets/z-icon.png'

type LayoutItemProps = {
  title: string
  href: string
  Icon: LucideIcon
}

const navItems: LayoutItemProps[] = [
  { title: '홈', href: '/', Icon: Home },
  { title: '탐색', href: '/search', Icon: Search },
  { title: '북마크', href: '/bookmark', Icon: Bookmark },
  { title: '채팅', href: '/chat', Icon: MessageCircle },
  { title: '프로필', href: '/profile', Icon: CircleUserRound },
]

function LayoutItem ({ title, href, Icon }: LayoutItemProps) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={`group flex w-full items-center gap-3 rounded-full py-1.5 text-[16px] transition-colors ${
        isActive
          ? 'text-white'
          : 'text-zinc-400 hover:text-white'
      }`}
    >
      <span className={`inline-flex size-11 items-center justify-center rounded-full transition-colors ${isActive ? 'bg-white/10 text-white' : 'group-hover:bg-white/10'}`}>
        <Icon className='size-[23px] shrink-0' strokeWidth={isActive ? 2.5 : 2} />
      </span>
      <h3 className={`leading-none ${isActive ? 'font-semibold' : 'font-normal'}`}>{title}</h3>
    </Link>
  )
}

function MobileLayoutItem ({ title, href, Icon }: LayoutItemProps) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      aria-label={title}
      className={`flex min-h-14 flex-col items-center justify-center rounded-2xl text-[11px] transition-colors ${
        isActive
          ? 'text-white'
          : 'text-zinc-500 hover:text-white'
      }`}
    >
      <Icon className='mb-1 size-5 shrink-0' strokeWidth={isActive ? 2.5 : 2} />
      <span>{title}</span>
    </Link>
  )
}

function Logo () {
  return (
    <Link
      href='/'
      aria-label='Z 홈'
      className='inline-flex size-12 items-center justify-center rounded-full transition-colors hover:bg-white/10'
    >
      <Image
        src={zIconSrc}
        className='h-7 w-auto object-contain'
        alt='Z'
        priority
      />
    </Link>
  )
}

function DesktopSidebar () {
  return (
    <aside className='hidden h-screen w-[188px] shrink-0 flex-col border-r border-border-subtle bg-bg px-6 py-[30px] text-white lg:flex'>
      <nav className='flex h-full flex-col items-stretch'>
        <Logo />
        <div className='mt-4 flex flex-col gap-1.5'>
          {navItems.map((item) => (
            <LayoutItem key={item.href} {...item} />
          ))}
        </div>
        {/*
        <div className='mt-auto flex w-full justify-start'>
          <button type='button'>더보기</button>
        </div>
        */}
      </nav>
    </aside>
  )
}

function MobileBottomNav () {
  return (
    <nav className='fixed inset-x-0 bottom-0 z-50 border-t border-border-subtle bg-bg/95 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur lg:hidden'>
      <div className='grid grid-cols-5 gap-1'>
        {navItems.map((item) => (
          <MobileLayoutItem key={item.href} {...item} />
        ))}
      </div>
    </nav>
  )
}

export default function Layout ({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen overflow-hidden bg-bg text-text-primary'>
      <DesktopSidebar />

      <main className='min-w-0 flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+5rem)] lg:pb-0'>
        {children}
      </main>

      <MobileBottomNav />
    </div>
  )
}
