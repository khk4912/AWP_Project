import Link from 'next/link'

import { PencilIcon } from 'lucide-react'
import GLogo from './GLogo'
import UserAvatar from './UserAvatar'

export default function MobileTopNav () {
  return (
    <nav className='fixed top-0 left-0 right-0 h-16
                   bg-white border-b border-gray-200
                    md:hidden flex z-10
                    items-center justify-between w-full
                    px-4'
    >
      <UserAvatar name='나' seed='me' size={32} />
      <GLogo size={32} color='#333' />
      <Link href='/write'>
        <PencilIcon className='h-5 w-5' />
      </Link>
    </nav>

  )
}
