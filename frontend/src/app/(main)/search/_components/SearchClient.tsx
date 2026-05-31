'use client'

import { FormEvent, useEffect, useState } from 'react'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import UserAvatar from '@/components/UserAvatar'
import { normalizeSearchTerm } from '@/lib/recent-searches'
import type { UserSummary } from '@/lib/types'
import { useRecentSearches, writeRecentSearch } from '@/lib/use-recent-searches'

type SearchClientProps = {
  initialQuery?: string
  users: UserSummary[]
}

function matchesUser (user: UserSummary, query: string): boolean {
  const normalizedQuery = query.toLocaleLowerCase()

  return [
    user.username,
    user.email ?? '',
    user.bio ?? '',
  ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery))
}

export default function SearchClient ({ initialQuery = '', users }: SearchClientProps) {
  const router = useRouter()
  const query = normalizeSearchTerm(initialQuery)
  const [searchTerm, setSearchTerm] = useState(query)
  const recentSearches = useRecentSearches()
  const matchingUsers = query.length > 0
    ? users.filter((user) => matchesUser(user, query)).slice(0, 20)
    : []

  useEffect(() => {
    if (query.length === 0) return

    writeRecentSearch(query)
  }, [query])

  function handleSubmit (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedTerm = normalizeSearchTerm(searchTerm)
    if (normalizedTerm.length === 0) return

    writeRecentSearch(normalizedTerm)
    router.replace(`/search?q=${encodeURIComponent(normalizedTerm)}`)
  }

  return (
    <div className='px-4 py-5'>
      <form className='relative' onSubmit={handleSubmit}>
        <SearchIcon className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500' />
        <input
          type='search'
          value={searchTerm}
          placeholder='검색'
          className='h-12 w-full rounded-full bg-gray-100 pl-12 pr-4 text-base text-gray-950 outline-none ring-blue-500 transition focus:bg-white focus:ring-2'
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </form>

      {query.length > 0
        ? (
          <section className='mt-6'>
            <h2 className='text-xl font-bold text-gray-950'>사용자</h2>
            {matchingUsers.length > 0
              ? (
                <div className='mt-3 divide-y divide-gray-100'>
                  {matchingUsers.map((user) => (
                    <Link
                      key={user._id}
                      href={`/profile/${user._id}`}
                      className='flex items-center gap-3 py-4 text-gray-950 hover:bg-gray-50'
                    >
                      <UserAvatar name={user.username} seed={user._id} size={44} noHref />
                      <div className='min-w-0 flex-1'>
                        <h3 className='truncate text-base font-bold'>{user.username}</h3>
                        <p className='truncate text-sm text-gray-500'>{user.email ?? user.bio ?? ''}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                )
              : <p className='mt-4 text-sm text-gray-500'>검색 결과가 없습니다.</p>}
          </section>
          )
        : null}

      {query.length === 0 && recentSearches.length > 0
        ? (
          <section className='mt-6'>
            <h2 className='text-xl font-bold text-gray-950'>최근 검색</h2>
            <div className='mt-3 divide-y divide-gray-100'>
              {recentSearches.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className='flex items-center gap-3 py-3 text-gray-950 hover:bg-gray-50'
                >
                  <SearchIcon className='h-5 w-5 shrink-0 text-gray-500' />
                  <span className='min-w-0 truncate text-base font-medium'>{term}</span>
                </Link>
              ))}
            </div>
          </section>
          )
        : null}
    </div>
  )
}
