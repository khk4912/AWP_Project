import { NextResponse, type NextRequest } from 'next/server'

import { requireAuthToken } from '@/lib/auth'

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'

export async function GET (request: NextRequest) {
  let token: string

  try {
    token = await requireAuthToken()
  } catch {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
  }

  const skip = request.nextUrl.searchParams.get('skip') ?? '0'
  const limit = request.nextUrl.searchParams.get('limit') ?? '10'
  const response = await fetch(`${backendUrl}/posts/feed?skip=${skip}&limit=${limit}`, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const body = await response.json() as unknown

  return NextResponse.json(body, { status: response.status })
}
