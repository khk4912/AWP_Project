'use client'

import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import Post from '@/components/Post'
import { fetchPosts } from '@/lib/api'
import type { PostsResponse } from '@/lib/types'
import type { FeedTab } from './FeedTabs'

const PAGE_SIZE = 10

type HomeFeedProps = {
  activeTab: FeedTab
  initialPosts: PostsResponse
}

export default function HomeFeed ({ activeTab, initialPosts }: HomeFeedProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', activeTab],
    initialPageParam: initialPosts.pagination.skip,
    queryFn: ({ pageParam }) => fetchPosts({
      feed: activeTab,
      skip: pageParam,
      limit: PAGE_SIZE,
    }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasMore) return undefined
      return lastPage.pagination.skip + lastPage.posts.length
    },
    initialData: {
      pages: [initialPosts],
      pageParams: [initialPosts.pagination.skip],
    },
  })

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (sentinel == null) return

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting === true && hasNextPage === true && !isFetchingNextPage) {
        fetchNextPage().catch(() => {
          // Error state is rendered from the query result.
        })
      }
    }, {
      rootMargin: '400px 0px',
    })

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const posts = data.pages.flatMap((page) => page.posts)

  return (
    <section aria-label='피드'>
      <div className='divide-y divide-gray-100'>
        {posts.length > 0
          ? posts.map((post) => (
            <Post key={post._id} post={post} href={`/post/${post._id}`} />
          ))
          : (
            <p className='px-4 py-8 text-center text-sm text-gray-500'>
              {activeTab === 'following'
                ? '팔로잉하는 사용자의 게시물이 없습니다.'
                : '추천 게시물이 없습니다.'}
            </p>
            )}
      </div>

      <div ref={sentinelRef} className='h-1' />

      {isFetchingNextPage
        ? <p className='px-4 py-6 text-center text-sm text-gray-500'>게시물을 불러오는 중...</p>
        : null}

      {isError
        ? <p className='px-4 py-6 text-center text-sm text-red-500'>{error.message}</p>
        : null}

      {!hasNextPage && posts.length > 0
        ? <p className='px-4 py-6 text-center text-sm text-gray-400'>더 불러올 게시물이 없습니다.</p>
        : null}
    </section>
  )
}
