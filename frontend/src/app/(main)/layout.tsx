'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import zIconSrc from '@assets/z-icon.png'
import { HomeIcon } from '@/components/icons/HomeIcon'
import { SearchIcon } from '@/components/icons/SearchIcon'
import { ChatIcon } from '@/components/icons/ChatIcon'
import { BookmarkIcon } from '@/components/icons/BookmarkIcon'
import { ProfileIcon } from '@/components/icons/ProfileIcon'

type LayoutItemProps = {
  title: string
  href: string
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

const navItems: LayoutItemProps[] = [
  { title: '홈', href: '/', Icon: HomeIcon },
  { title: '탐색', href: '/search', Icon: SearchIcon },
  { title: '북마크', href: '/bookmark', Icon: BookmarkIcon },
  { title: '채팅', href: '/chat', Icon: ChatIcon },
  { title: '프로필', href: '/profile', Icon: ProfileIcon },
]

function LayoutItem ({ title, href, Icon }: LayoutItemProps) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={`flex items-center justify-center gap-0 rounded-full px-3 py-3 transition-colors md:w-full md:justify-start md:gap-3 md:px-0 ${
        isActive
          ? 'text-white'
          : 'text-zinc-300 hover:text-white'
      }`}
    >
      <span className={`inline-flex size-10 items-center justify-center rounded-full transition-colors ${isActive ? 'bg-white/10' : 'hover:bg-white/10'}`}>
        <Icon className='size-6 shrink-0 fill-current' />
      </span>
      <h3 className={`hidden text-[16px] md:block ${isActive ? 'font-semibold' : 'font-normal'}`}>{title}</h3>
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
      <Icon className='mb-1 size-5 shrink-0 fill-current' />
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
        className='h-8 w-auto object-contain'
        alt='Z'
        priority
      />
    </Link>
  )
}

function DesktopSidebar () {
  return (
    <aside className='hidden h-screen w-[86px] shrink-0 flex-col border-r border-border-subtle bg-bg px-4 py-[30px] text-white sm:flex lg:w-[188px] lg:px-6'>
      <nav className='flex h-full flex-col items-center gap-4 lg:items-stretch'>
        <Logo />
        <div className='mt-2' />
        {navItems.map((item) => (
          <LayoutItem key={item.href} {...item} />
        ))}
        <div className='mt-auto flex w-full justify-center lg:justify-start'>
          <div className='flex size-12 items-center justify-center rounded-full border border-border-subtle text-zinc-400 lg:h-auto lg:w-full lg:justify-start lg:gap-3 lg:rounded-xl lg:px-3 lg:py-2'>
            <ProfileIcon className='size-6 shrink-0 fill-current' />
            <div className='hidden lg:block'>
              <p className='text-sm font-medium text-text-primary'>내 프로필</p>
              <p className='text-xs text-text-muted'>@z_user</p>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  )
}

function MobileBottomNav () {
  return (
    <nav className='fixed inset-x-0 bottom-0 z-50 border-t border-border-subtle bg-bg/95 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur sm:hidden'>
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

      <main className='min-w-0 flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+5rem)] sm:pb-0'>
        {children}
      </main>

      <MobileBottomNav />
    </div>
  )
}
