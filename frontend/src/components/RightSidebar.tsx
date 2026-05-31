'use client'

import { SearchIcon } from 'lucide-react'
import Link from 'next/link'

import UserAvatar from './UserAvatar'
import type { UserSummary } from '@/lib/types'
import { useRecentSearches } from '@/lib/use-recent-searches'

type RightSidebarProps = {
  currentUserId?: string
  users: UserSummary[]
}

export default function RightSidebar ({ currentUserId, users }: RightSidebarProps) {
  const recentSearches = useRecentSearches()
  const recommendedUsers = users.filter((user) => user._id !== currentUserId).slice(0, 3)

  return (
    <aside className='sticky top-0 hidden h-screen w-80 shrink-0 overflow-y-auto border-l border-gray-100 bg-white px-6 py-4 xl:block'>
      <section className='mt-5 rounded-lg bg-gray-100 px-4 py-4'>
        <h2 className='text-xl font-bold text-gray-950'>당신을 위한 추천</h2>
        <div className='mt-4 divide-y divide-gray-200'>
          {recentSearches.length > 0
            ? recentSearches.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className='flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:text-blue-500'
              >
                <SearchIcon className='h-5 w-5 shrink-0 text-gray-500' />
                <span className='min-w-0 truncate text-base font-bold text-gray-950'>{term}</span>
              </Link>
            ))
            : <p className='py-3 text-sm text-gray-500'>최근 검색어가 없습니다.</p>}
        </div>
      </section>

      <section className='mt-5 rounded-lg bg-gray-100 px-4 py-4'>
        <h2 className='text-xl font-bold text-gray-950'>추천 사용자</h2>
        <div className='mt-4 divide-y divide-gray-200'>
          {recommendedUsers.map((user) => (
            <article key={user._id} className='first:pt-0 last:pb-0'>
              <Link
                href={`/profile/${user._id}`}
                className='flex items-center gap-3 py-3 hover:text-blue-500'
              >
                <UserAvatar name={user.username} seed={user._id} size={40} noHref />
                <div className='min-w-0 flex-1'>
                  <h3 className='truncate text-sm font-bold text-gray-950'>{user.username}</h3>
                  <p className='truncate text-sm text-gray-500'>{user.email ?? user.bio ?? ''}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <footer className='mt-5 px-1 text-xs text-gray-400'>
        © 2026 G
      </footer>
    </aside>
  )
}
