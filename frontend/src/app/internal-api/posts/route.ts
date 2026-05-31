import { NextResponse, type NextRequest } from 'next/server'

import { requireAuthToken } from '@/lib/auth'

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'

type CreatePostBody = {
  content?: unknown
  imageUrl?: unknown
}

export async function GET (request: NextRequest) {
  const skip = request.nextUrl.searchParams.get('skip') ?? '0'
  const limit = request.nextUrl.searchParams.get('limit') ?? '10'
  const response = await fetch(`${backendUrl}/posts?skip=${skip}&limit=${limit}`, {
    cache: 'no-store',
  })
  const body = await response.json() as unknown

  return NextResponse.json(body, { status: response.status })
}

export async function POST (request: Request) {
  let token: string

  try {
    token = await requireAuthToken()
  } catch {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
  }

  const body = await request.json() as CreatePostBody
  const content = typeof body.content === 'string' ? body.content.trim() : ''
  const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl : ''

  if (content.length === 0) {
    return NextResponse.json({ message: 'Content is required' }, { status: 400 })
  }

  const response = await fetch(`${backendUrl}/posts`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, imageUrl }),
  })

  const responseBody = await response.json() as unknown

  return NextResponse.json(responseBody, { status: response.status })
}
