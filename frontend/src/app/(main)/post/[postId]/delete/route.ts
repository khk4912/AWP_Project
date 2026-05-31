import { redirect } from 'next/navigation'

import { requireAuthToken } from '@/lib/auth'

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'

type DeletePostRouteProps = {
  params: Promise<{
    postId: string
  }>
}

export async function POST (
  _request: Request,
  { params }: DeletePostRouteProps
) {
  const { postId } = await params
  const token = await requireAuthToken()

  const response = await fetch(`${backendUrl}/posts/${postId}`, {
    method: 'DELETE',
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete post')
  }

  redirect('/home')
}
