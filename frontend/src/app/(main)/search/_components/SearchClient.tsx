'use client'

import { FormEvent, useEffect, useState } from 'react'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { normalizeSearchTerm } from '@/lib/recent-searches'
import { useRecentSearches, writeRecentSearch } from '@/lib/use-recent-searches'

type SearchClientProps = {
  initialQuery?: string
}

export default function SearchClient ({ initialQuery = '' }: SearchClientProps) {
  const router = useRouter()
  const query = normalizeSearchTerm(initialQuery)
  const [searchTerm, setSearchTerm] = useState(query)
  const recentSearches = useRecentSearches()

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

      {recentSearches.length > 0
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
