import type { PostsResponse } from './types'

type PostFeed = 'recommended' | 'following'

type FetchPostsOptions = {
  feed: PostFeed
  skip?: number
  limit?: number
}

type CreatePostInput = {
  content: string
  imageUrl?: string
}

export async function fetchPosts ({
  feed,
  skip = 0,
  limit = 10,
}: FetchPostsOptions): Promise<PostsResponse> {
  const endpoint = feed === 'following' ? '/internal-api/posts/feed' : '/internal-api/posts'
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

export async function createPost ({ content, imageUrl = '' }: CreatePostInput): Promise<void> {
  const response = await fetch('/internal-api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, imageUrl }),
  })

  if (!response.ok) {
    throw new Error('Failed to create post')
  }
}

export async function likePost (postId: string): Promise<void> {
  const response = await fetch(`/internal-api/posts/${postId}/like`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to like post')
  }
}

export async function unlikePost (postId: string): Promise<void> {
  const response = await fetch(`/internal-api/posts/${postId}/unlike`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to unlike post')
  }
}
