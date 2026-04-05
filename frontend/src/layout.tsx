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
        `inline-flex w-fit items-center gap-4 rounded-full px-4 py-3 transition-colors not-md:h-12 not-md:w-12 not-md:justify-center not-md:gap-0 not-md:px-0 ${
          isActive
            ? 'bg-zinc-800 text-white font-bold'
            : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
        }`
      )}
    >
      <Icon className='h-7 w-7 shrink-0 fill-current' />
      <h3 className='text-xl not-md:hidden'>{title}</h3>
    </NavLink>
  )
}

const Logo = () => (
  <Link
    to='/'
    className='w-fit h-fit px-4 py-2 not-md:p-2
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
    <div className='flex bg-black min-h-screen '>
      <aside className='h-screen w-60 shrink-0 px-4 sticky top-0
                        not-md:w-20 not-md:px-2
                        flex flex-col border-r border-zinc-600 text-white'
      >
        <nav className='h-full flex flex-col gap-3 py-3 not-md:items-center'>
          <Logo />
          <LayoutItem title='홈' href='/' Icon={HomeIcon} />
          <LayoutItem title='탐색' href='/search' Icon={SearchIcon} />
          <LayoutItem title='북마크' href='/bookmark' Icon={BookmarkIcon} />
          <LayoutItem title='채팅' href='/chat' Icon={ChatIcon} />
          <LayoutItem title='프로필' href='/profile' Icon={ProfileIcon} />
          <div className='mt-auto not-md:flex not-md:w-full not-md:justify-center'>
            <div className='flex items-center gap-3 rounded-2xl border-2 border-zinc-800 px-4 py-2 not-md:h-12 not-md:w-12 not-md:justify-center not-md:gap-0 not-md:px-0'>
              <ProfileIcon className='w-6' />
              <div className='not-md:hidden'>
                <p className='text-sm text-zinc-300'>프로필</p>
                <p className='text-sm text-zinc-500'>@profile</p>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <Outlet />

    </div>
  )
}
