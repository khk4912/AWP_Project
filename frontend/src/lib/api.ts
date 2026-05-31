import type { Comment, PostsResponse } from './types'

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

export async function fetchComments (postId: string): Promise<Comment[]> {
  const response = await fetch(`/internal-api/comments/post/${postId}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch comments')
  }

  return response.json() as Promise<Comment[]>
}

export async function createComment ({
  postId,
  content,
}: {
  postId: string
  content: string
}): Promise<void> {
  const response = await fetch('/internal-api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postId, content }),
  })

  if (!response.ok) {
    throw new Error('Failed to create comment')
  }
}

export async function deleteComment (commentId: string): Promise<void> {
  const response = await fetch(`/internal-api/comments/${commentId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete comment')
  }
}

export async function followUser (targetUserId: string): Promise<void> {
  const response = await fetch('/internal-api/follow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetUserId }),
  })

  if (!response.ok) {
    throw new Error('Failed to follow user')
  }
}

export async function unfollowUser (targetUserId: string): Promise<void> {
  const response = await fetch('/internal-api/follow/unfollow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetUserId }),
  })

  if (!response.ok) {
    throw new Error('Failed to unfollow user')
  }
}
