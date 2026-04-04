import { Link, Outlet } from 'react-router'

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
    <Link
      to={href}
      className='w-fit h-fit px-4 py-2 hover:bg-zinc-800 transition-colors rounded-full'
    >
      <div className='flex gap-3 items-center'>
        <Icon className='w-6 h-6' />
        <h3 className='text-xl'>{title}</h3>
      </div>
    </Link>
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
      <aside className='min-h-screen px-2 w-60 border-r border-zinc-600 text-white'>
        <nav className='flex flex-col py-10 gap-6'>
          <Logo />
          <LayoutItem title='홈' href='/' Icon={HomeIcon} />
          <LayoutItem title='탐색' href='/' Icon={SearchIcon} />
          <LayoutItem title='북마크' href='/' Icon={BookmarkIcon} />
          <LayoutItem title='채팅' href='/' Icon={ChatIcon} />
          <LayoutItem title='프로필' href='/' Icon={ProfileIcon} />
        </nav>
      </aside>

      <main className='px-6 py-8 flex-1 bg-white'>
        <Outlet />
      </main>
    </div>
  )
}
