import { NextResponse } from 'next/server'

import { requireAuthToken } from '@/lib/auth'

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'

type CreateCommentBody = {
  postId?: unknown
  content?: unknown
}

export async function POST (request: Request) {
  let token: string

  try {
    token = await requireAuthToken()
  } catch {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
  }

  const body = await request.json() as CreateCommentBody
  const postId = typeof body.postId === 'string' ? body.postId : ''
  const content = typeof body.content === 'string' ? body.content.trim() : ''

  if (postId.length === 0 || content.length === 0) {
    return NextResponse.json({ message: 'Comment content is required' }, { status: 400 })
  }

  const response = await fetch(`${backendUrl}/comments`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId, content }),
  })
  const responseBody = await response.json() as unknown

  return NextResponse.json(responseBody, { status: response.status })
}
