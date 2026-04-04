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
  >;
}
function LayoutItem ({ title, href, Icon }: LayoutItemProps) {
  return (
    <NavLink
      to={href}
      end={href === '/'}
      className={({ isActive }) => (
        `inline-flex items-center gap-4 rounded-full px-4 py-3 transition-colors ${
          isActive
            ? 'bg-zinc-800 text-white'
            : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
        }`
      )}
    >
      <Icon className='h-7 w-7 shrink-0 fill-current' />
      <h3 className='text-xl'>{title}</h3>
    </NavLink>
  )
}

const Logo = () => (
  <Link
    to='/'
    className='w-fit h-fit px-4 py-2
             hover:bg-zinc-800 transition-colors
               rounded-full'
  >
    <img
      src={gIconSrc}
      className='w-8'
      alt='Project Z Icon'
    />
  </Link>
)

export default function Layout () {
  return (
    <div className='flex bg-black min-h-screen'>
      <aside className='flex min-h-screen w-60 flex-col border-r border-zinc-600 px-4 text-white'>
        <nav className='h-full flex flex-col gap-3 py-10'>
          <Logo />
          <LayoutItem title='홈' href='/' Icon={HomeIcon} />
          <LayoutItem title='탐색' href='/search' Icon={SearchIcon} />
          <LayoutItem title='북마크' href='/bookmark' Icon={BookmarkIcon} />
          <LayoutItem title='채팅' href='/chat' Icon={ChatIcon} />
          <LayoutItem title='프로필' href='/profile' Icon={ProfileIcon} />
          <div className='flex-1 flex flex-col justify-end'>
            <div className='flex items-center gap-3 rounded-2xl border-2 border-zinc-800 px-4 py-2'>
              <ProfileIcon className='w-6' />
              <div>
                <p className='text-sm text-zinc-300'>프로필</p>
                <p className='text-sm text-zinc-500'>@profile</p>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <main className='px-6 py-8 flex-1 bg-white'>
        <Outlet />
      </main>
    </div>
  )
}
