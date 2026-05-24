import type {
  Comment,
  FollowRelations,
  IdResponse,
  LoginResponse,
  Post,
  PostsResponse,
  UserProfile,
  UserSummary,
} from './types'

const API_BASE_PATH = '/api'

type ApiFetchOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown
  headers?: HeadersInit
  token?: string | null
}

function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function messageFromUnknown (value: unknown): string | null {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    const first = value.find((item) => typeof item === 'string')
    return typeof first === 'string' ? first : null
  }
  if (isRecord(value)) {
    const message = value.message
    const nestedError = value.error
    return messageFromUnknown(message) ?? messageFromUnknown(nestedError)
  }
  return null
}

function parseErrorMessage (payload: unknown, fallback: string): string {
  if (!isRecord(payload)) return messageFromUnknown(payload) ?? fallback
  return messageFromUnknown(payload.error) ?? messageFromUnknown(payload.message) ?? fallback
}

async function parseResponsePayload (response: Response): Promise<unknown> {
  if (response.status === 204) return null

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const parsed: unknown = await response.json()
    return parsed
  }

  return response.text()
}

export class ApiError extends Error {
  readonly statusCode: number
  readonly payload: unknown

  constructor (message: string, statusCode: number, payload: unknown) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.payload = payload
  }
}

export function isApiError (error: unknown): error is ApiError {
  return error instanceof ApiError
}

export async function apiFetch<T> (path: string, options: ApiFetchOptions = {}): Promise<T> {
  const {
    body,
    headers: customHeaders,
    token,
    ...requestOptions
  } = options

  const headers = new Headers(customHeaders)
  if (body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token != null && token.length > 0) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_PATH}${path}`, {
    ...requestOptions,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const payload = await parseResponsePayload(response)

  if (!response.ok) {
    throw new ApiError(
      parseErrorMessage(payload, '요청을 처리하지 못했습니다.'),
      response.status,
      payload
    )
  }

  return payload as T
}

export function login (email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function register (username: string, email: string, password: string): Promise<IdResponse> {
  return apiFetch<IdResponse>('/auth/register', {
    method: 'POST',
    body: { username, email, password },
  })
}

export function getUsers (): Promise<UserSummary[]> {
  return apiFetch<UserSummary[]>('/users', { cache: 'no-store' })
}

export function getUser (userId: string): Promise<UserProfile> {
  return apiFetch<UserProfile>(`/users/${userId}`, { cache: 'no-store' })
}

type GetPostsOptions = {
  limit?: number
  skip?: number
  token?: string | null
}

function withPagination (path: string, options: GetPostsOptions = {}): string {
  const params = new URLSearchParams()
  if (options.skip !== undefined) params.set('skip', options.skip.toString())
  if (options.limit !== undefined) params.set('limit', options.limit.toString())
  const query = params.toString()
  return query.length > 0 ? `${path}?${query}` : path
}

export function getPosts (options: GetPostsOptions = {}): Promise<PostsResponse> {
  return apiFetch<PostsResponse>(withPagination('/posts', options), {
    cache: 'no-store',
    token: options.token
  })
}

export function getFeedPosts (token: string, options: GetPostsOptions = {}): Promise<PostsResponse> {
  return apiFetch<PostsResponse>(withPagination('/posts/feed', options), {
    cache: 'no-store',
    token
  })
}

export function getPost (postId: string): Promise<Post> {
  return apiFetch<Post>(`/posts/${postId}`, { cache: 'no-store' })
}

export function createPost (token: string, content: string): Promise<IdResponse> {
  return apiFetch<IdResponse>('/posts', {
    method: 'POST',
    token,
    body: { content },
  })
}

export function deletePost (token: string, postId: string): Promise<IdResponse> {
  return apiFetch<IdResponse>(`/posts/${postId}`, {
    method: 'DELETE',
    token,
  })
}

type UpdatePostInput = {
  content?: string
  imageUrl?: string
}

export function updatePost (token: string, postId: string, data: UpdatePostInput): Promise<IdResponse> {
  return apiFetch<IdResponse>(`/posts/${postId}`, {
    method: 'PATCH',
    token,
    body: data,
  })
}

export function likePost (token: string, postId: string): Promise<IdResponse> {
  return apiFetch<IdResponse>(`/posts/${postId}/like`, {
    method: 'POST',
    token,
  })
}

export function unlikePost (token: string, postId: string): Promise<IdResponse> {
  return apiFetch<IdResponse>(`/posts/${postId}/unlike`, {
    method: 'POST',
    token,
  })
}

export function getComments (postId: string): Promise<Comment[]> {
  return apiFetch<Comment[]>(`/comments/post/${postId}`, { cache: 'no-store' })
}

export function createComment (token: string, postId: string, content: string): Promise<IdResponse> {
  return apiFetch<IdResponse>('/comments', {
    method: 'POST',
    token,
    body: { postId, content },
  })
}

export function deleteComment (token: string, commentId: string): Promise<IdResponse> {
  return apiFetch<IdResponse>(`/comments/${commentId}`, {
    method: 'DELETE',
    token,
  })
}

export function getFollowRelations (userId: string): Promise<FollowRelations> {
  return apiFetch<FollowRelations>(`/follow/${userId}`, { cache: 'no-store' })
}

export function followUser (token: string, targetUserId: string): Promise<IdResponse> {
  return apiFetch<IdResponse>('/follow', {
    method: 'POST',
    token,
    body: { targetUserId },
  })
}

export function unfollowUser (token: string, targetUserId: string): Promise<IdResponse> {
  return apiFetch<IdResponse>('/follow/unfollow', {
    method: 'POST',
    token,
    body: { targetUserId },
  })
}
