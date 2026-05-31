'use client'

import Post from '@/components/Post'
import type { PostsResponse } from '@/lib/types'
import type { FeedTab } from './FeedTabs'

type HomeFeedProps = {
  activeTab: FeedTab
  initialPosts?: PostsResponse
  followingPosts?: PostsResponse
}

export default function HomeFeed ({ activeTab, initialPosts, followingPosts }: HomeFeedProps) {
  return (
    <section aria-label='피드' className='divide-y divide-gray-100'>
      {(activeTab === 'following' ? followingPosts : initialPosts)?.posts.map((post) => (
        <Post key={post._id} post={post} href={`/post/${post._id}`} />
      )) ?? (
        <p className='px-4 py-8 text-center text-sm text-gray-500'>
          {activeTab === 'following'
            ? '팔로잉하는 사용자의 게시물이 없습니다.'
            : '추천 게시물이 없습니다.'}
        </p>
      )}
    </section>
  )
}
