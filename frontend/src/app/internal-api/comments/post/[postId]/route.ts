import { NextResponse } from 'next/server'

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'

type CommentsByPostRouteProps = {
  params: Promise<{
    postId: string
  }>
}

export async function GET (
  _request: Request,
  { params }: CommentsByPostRouteProps
) {
  const { postId } = await params
  const response = await fetch(`${backendUrl}/comments/post/${postId}`, {
    cache: 'no-store',
  })
  const body = await response.json() as unknown

  return NextResponse.json(body, { status: response.status })
}
