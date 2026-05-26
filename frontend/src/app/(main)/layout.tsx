'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import {
  CircleUserRound,
  Home,
  LogIn,
  LogOut,
  Search,
  type LucideIcon,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { RightRail } from '@/components/RightRail'
import { clearAuthToken, getAuthToken } from '@/lib/auth'

import zIconSrc from '@assets/z-icon.png'

const AUTH_CHANGED_EVENT = 'auth-token-changed'

type LayoutItemProps = {
  title: string
  href: string
  Icon: LucideIcon
}

const navItems: LayoutItemProps[] = [
  { title: '홈', href: '/', Icon: Home },
  { title: '탐색', href: '/search', Icon: Search },
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
      aria-label='G 홈'
      className='inline-flex size-12 items-center justify-center rounded-full transition-colors hover:bg-white/10'
    >
      <Image
        src={zIconSrc}
        className='h-7 w-auto object-contain'
        alt='G'
        priority
      />
    </Link>
  )
}

function LogoutButton () {
  function handleLogout () {
    clearAuthToken()
    window.location.href = '/'
  }

  return (
    <button
      type='button'
      onClick={handleLogout}
      className='inline-flex w-full items-center gap-2 rounded-full border border-border-subtle px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-white/10'
    >
      <LogOut className='size-4 shrink-0' strokeWidth={2} aria-hidden='true' />
      로그아웃
    </button>
  )
}

function LoginButton () {
  return (
    <Link
      href='/login'
      className='inline-flex items-center gap-2 rounded-full border border-border-subtle px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-white/10'
    >
      <LogIn className='size-4 shrink-0' strokeWidth={2} aria-hidden='true' />
      로그인
    </Link>
  )
}

function SidebarAuthButton () {
  const [ready, setReady] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    function syncAuthState () {
      setLoggedIn(getAuthToken() != null)
      setReady(true)
    }

    syncAuthState()
    window.addEventListener(AUTH_CHANGED_EVENT, syncAuthState)
    window.addEventListener('storage', syncAuthState)

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuthState)
      window.removeEventListener('storage', syncAuthState)
    }
  }, [])

  if (!ready) return null
  return loggedIn ? <LogoutButton /> : <LoginButton />
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
        <div className='mt-auto'>
          <SidebarAuthButton />
        </div>
      </nav>
    </aside>
  )
}

function MobileBottomNav () {
  return (
    <nav className='fixed inset-x-0 bottom-0 z-50 border-t border-border-subtle bg-bg/95 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur lg:hidden'>
      <div className='grid grid-cols-3 gap-1'>
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
      <RightRail />

      <MobileBottomNav />
    </div>
  )
}
