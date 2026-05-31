import 'server-only'

import { requireAuthToken } from '@/lib/auth'
import type { Comment, Post, PostsResponse } from '@/lib/types'

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'

export async function getPosts (skip = 0, limit = 10): Promise<PostsResponse> {
  const res = await fetch(`${backendUrl}/posts?skip=${skip}&limit=${limit}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }

  return res.json() as Promise<PostsResponse>
}

export async function getFollowingPosts (skip = 0, limit = 10): Promise<PostsResponse> {
  const token = await requireAuthToken()

  const res = await fetch(`${backendUrl}/posts/feed?skip=${skip}&limit=${limit}`, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch feed')
  }

  return res.json() as Promise<PostsResponse>
}

export async function getPost (postId: string): Promise<Post> {
  const res = await fetch(`${backendUrl}/posts/${postId}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch post')
  }

  return res.json() as Promise<Post>
}

export async function getComments (postId: string): Promise<Comment[]> {
  const res = await fetch(`${backendUrl}/comments/post/${postId}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch comments')
  }

  return res.json() as Promise<Comment[]>
}
