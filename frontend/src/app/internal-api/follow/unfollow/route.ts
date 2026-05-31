import { NextResponse } from 'next/server'

import { requireAuthToken } from '@/lib/auth'

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'

type UnfollowBody = {
  targetUserId?: unknown
}

export async function POST (request: Request) {
  let token: string

  try {
    token = await requireAuthToken()
  } catch {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
  }

  const body = await request.json() as UnfollowBody
  const targetUserId = typeof body.targetUserId === 'string' ? body.targetUserId : ''

  if (targetUserId.length === 0) {
    return NextResponse.json({ message: 'targetUserId is required' }, { status: 400 })
  }

  const response = await fetch(`${backendUrl}/follow/unfollow`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ targetUserId }),
  })
  const responseBody = await response.json() as unknown

  return NextResponse.json(responseBody, { status: response.status })
}
