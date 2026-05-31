import { NextResponse } from 'next/server'

import { requireAuthToken } from '@/lib/auth'

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'

type CommentRouteProps = {
  params: Promise<{
    commentId: string
  }>
}

export async function DELETE (
  _request: Request,
  { params }: CommentRouteProps
) {
  let token: string

  try {
    token = await requireAuthToken()
  } catch {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
  }

  const { commentId } = await params
  const response = await fetch(`${backendUrl}/comments/${commentId}`, {
    method: 'DELETE',
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const body = await response.json() as unknown

  return NextResponse.json(body, { status: response.status })
}
