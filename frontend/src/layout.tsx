import { Link, NavLink, Outlet } from 'react-router'

import gIconSrc from '@assets/g-icon.png'

import HomeIcon from '@assets/home.svg?react'
import SearchIcon from '@assets/search.svg?react'
import ChatIcon from '@assets/chat.svg?react'
import BookmarkIcon from '@assets/bookmark.svg?react'
import ProfileIcon from '@assets/profile.svg?react'

type LayoutItemProps = {
  title: string,
  href: string,
  Icon: React.FunctionComponent<
    React.ComponentProps<'svg'> & { title?: string, titleId?: string, desc?: string, descId?: string }
  >
}

const navItems: LayoutItemProps[] = [
  { title: '홈', href: '/', Icon: HomeIcon },
  { title: '탐색', href: '/search', Icon: SearchIcon },
  { title: '북마크', href: '/bookmark', Icon: BookmarkIcon },
  { title: '채팅', href: '/chat', Icon: ChatIcon },
  { title: '프로필', href: '/profile', Icon: ProfileIcon },
]

function LayoutItem ({ title, href, Icon }: LayoutItemProps) {
  return (
    <NavLink
      to={href}
      end={href === '/'}
      className={({ isActive }) => (
        `flex items-center justify-center rounded-2xl transition-colors ${
          isActive
            ? 'bg-bg-hover text-primary font-bold'
            : 'text-zinc-300 hover:bg-bg-hover hover:text-white'
        } md:h-auto md:w-full md:justify-start md:gap-4 md:px-4 md:py-3`
      )}
    >
      <Icon className='h-7 w-7 p-[0.125rem] shrink-0 fill-current' />
      <h3 className='hidden text-lg md:block'>{title}</h3>
    </NavLink>
  )
}

function MobileLayoutItem ({ title, href, Icon }: LayoutItemProps) {
  return (
    <NavLink
      to={href}
      end={href === '/'}
      aria-label={title}
      className={({ isActive }) => (
        `flex min-h-14 flex-col items-center justify-center rounded-2xl text-[11px] transition-colors ${
          isActive
            ? 'bg-bg text-primary font-bold'
            : 'text-zinc-400 hover:bg-secondary hover:text-white'
        }`
      )}
    >
      <Icon className='mb-1 h-5 w-5 shrink-0 fill-current' />
      <span>{title}</span>
    </NavLink>
  )
}

const Logo = () => (
  <Link
    to='/'
    className='h-fit w-fit rounded-full p-2 transition-colors hover:bg-bg md:px-4 md:py-2'
  >
    <img
      src={gIconSrc}
      className='w-8'
      alt='Project Z Icon'
    />
  </Link>
)

function DesktopSidebar () {
  return (
    <aside className='hidden h-screen w-20 shrink-0 flex-col border-r border-zinc-800 px-2 text-white sm:flex md:w-60 md:px-4'>
      <nav className='flex h-full flex-col items-center gap-3 py-3 md:items-stretch'>
        <Logo />
        <div className='mt-4' />
        {navItems.map((item) => (
          <LayoutItem key={item.href} {...item} />
        ))}
        <div className='mt-auto flex w-full md:block'>
          <div className='flex h-12 w-12 items-center rounded-2xl border-2 border-zinc-800 md:h-auto md:w-auto md:gap-3 md:px-4 md:py-2'>
            <ProfileIcon className='w-6 shrink-0' />
            <div className='hidden md:block'>
              <p className='text-sm text-zinc-300'>프로필</p>
              <p className='text-sm text-zinc-500'>@profile</p>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  )
}

function MobileBottomNav () {
  return (
    <nav className='fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-bg px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur sm:hidden'>
      <div className='grid grid-cols-5 gap-1'>
        {navItems.map((item) => (
          <MobileLayoutItem key={item.href} {...item} />
        ))}
      </div>
    </nav>
  )
}

export default function Layout () {
  return (
    <div className='flex h-screen overflow-hidden bg-bg text-white'>
      <DesktopSidebar />

      <main className='min-w-0 flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+5rem)] sm:pb-0'>
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  )
}
