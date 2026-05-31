import type { PostsResponse } from './types'

type PostFeed = 'recommended' | 'following'

type FetchPostsOptions = {
  feed: PostFeed
  skip?: number
  limit?: number
}

export async function fetchPosts ({
  feed,
  skip = 0,
  limit = 10,
}: FetchPostsOptions): Promise<PostsResponse> {
  const endpoint = feed === 'following' ? '/api/posts/feed' : '/api/posts'
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  })

  const response = await fetch(`${endpoint}?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  return response.json() as Promise<PostsResponse>
}
