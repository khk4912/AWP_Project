import 'server-only'

import { requireAuthToken } from '@/lib/auth'
import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import type { Comment, FollowRelations, Post, PostsResponse, UserProfile, UserSummary } from '@/lib/types'

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'
const USER_POSTS_PAGE_SIZE = 50

function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getString (value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function getId (value: unknown): string {
  if (typeof value === 'string') return value
  return ''
}

function normalizeUserSummary (value: unknown): UserSummary {
  const record = isRecord(value) ? value : {}

  return {
    _id: getId(record._id),
    username: getString(record.username) || '사용자',
    email: getString(record.email) || undefined,
    profileImage: getString(record.profileImage),
    bio: getString(record.bio) || undefined,
  }
}

function normalizeUserProfile (value: unknown): UserProfile {
  const record = isRecord(value) ? value : {}
  const user = normalizeUserSummary(record)

  return {
    ...user,
    followers: Array.isArray(record.followers)
      ? record.followers.filter(isRecord).map(normalizeUserSummary)
      : undefined,
    following: Array.isArray(record.following)
      ? record.following.filter(isRecord).map(normalizeUserSummary)
      : undefined,
  }
}

function normalizeFollowRelations (value: unknown): FollowRelations {
  const record = isRecord(value) ? value : {}
  const followers = Array.isArray(record.followers)
    ? record.followers.filter(isRecord).map(normalizeUserSummary)
    : []
  const following = Array.isArray(record.following)
    ? record.following.filter(isRecord).map(normalizeUserSummary)
    : []

  return {
    userId: getId(record.userId),
    followers,
    following,
    followerCount: typeof record.followerCount === 'number' ? record.followerCount : followers.length,
    followingCount: typeof record.followingCount === 'number' ? record.followingCount : following.length,
  }
}

export async function getPosts (skip = 0, limit = 10): Promise<PostsResponse> {
  const res = await fetch(`${backendUrl}/posts?skip=${skip}&limit=${limit}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }

  return res.json() as Promise<PostsResponse>
}

export async function getUserPosts (userId: string): Promise<Post[]> {
  const posts: Post[] = []
  let skip = 0
  let hasMore = true

  while (hasMore) {
    const response = await getPosts(skip, USER_POSTS_PAGE_SIZE)
    posts.push(...response.posts.filter((post) => post.author._id === userId))

    hasMore = response.pagination.hasMore && response.posts.length > 0
    skip += response.posts.length
  }

  return posts
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

export async function getUsers (): Promise<UserSummary[]> {
  const res = await fetch(`${backendUrl}/users`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }

  const users = await res.json() as unknown
  return Array.isArray(users) ? users.map(normalizeUserSummary) : []
}

export async function getUser (userId: string): Promise<UserProfile> {
  const res = await fetch(`${backendUrl}/users/${userId}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch user')
  }

  return normalizeUserProfile(await res.json() as unknown)
}

export async function getCurrentUser (): Promise<UserProfile | null> {
  const token = await getAuthToken()
  const userId = getUserIdFromToken(token)

  if (userId.length === 0) return null

  try {
    return await getUser(userId)
  } catch {
    return null
  }
}

export async function getFollowRelations (userId: string): Promise<FollowRelations> {
  const res = await fetch(`${backendUrl}/follow/${userId}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch follow relations')
  }

  return normalizeFollowRelations(await res.json() as unknown)
}
