import { NextResponse } from 'next/server'

import { requireAuthToken } from '@/lib/auth'

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'

type LikePostRouteProps = {
  params: Promise<{
    postId: string
  }>
}

export async function POST (
  _request: Request,
  { params }: LikePostRouteProps
) {
  let token: string

  try {
    token = await requireAuthToken()
  } catch {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
  }

  const { postId } = await params
  const response = await fetch(`${backendUrl}/posts/${postId}/like`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const body = await response.json() as unknown

  return NextResponse.json(body, { status: response.status })
}
