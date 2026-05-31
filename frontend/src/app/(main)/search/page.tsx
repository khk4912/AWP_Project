import SearchClient from './_components/SearchClient'

import { getUsers } from '@/lib/server/api'

type SearchPageProps = {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchPage ({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const users = await getUsers().catch(() => [])

  return (
    <section className='min-h-screen w-full border-x border-gray-200 bg-white pt-16 md:pt-0'>
      <SearchClient key={q ?? ''} initialQuery={q} users={users} />
    </section>
  )
}
