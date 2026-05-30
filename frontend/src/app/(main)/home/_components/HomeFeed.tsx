'use client'

import Post from '@/components/Post'
import { mockCurrentUser, mockPosts } from '@/lib/mock'

import type { FeedTab } from './FeedTabs'

type HomeFeedProps = {
  activeTab: FeedTab
}

export default function HomeFeed ({ activeTab }: HomeFeedProps) {
  const posts = activeTab === 'following'
    ? mockPosts.filter((post) => post.author._id !== mockCurrentUser._id).slice(0, 2)
    : mockPosts

  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post._id}
          post={post}
          currentUserId={mockCurrentUser._id}
        />
      ))}
    </div>
  )
}
