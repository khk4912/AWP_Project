'use server'

import { redirect } from 'next/navigation'

import { requireAuthToken } from '@/lib/auth'

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'

function getStringField (formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

export async function updatePostAction (formData: FormData) {
  const postId = getStringField(formData, 'postId')
  const content = getStringField(formData, 'content').trim()
  const imageUrl = getStringField(formData, 'imageUrl')

  if (postId.length === 0 || content.length === 0) {
    throw new Error('Post content is required')
  }

  const token = await requireAuthToken()
  const response = await fetch(`${backendUrl}/posts/${postId}`, {
    method: 'PATCH',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, imageUrl }),
  })

  if (!response.ok) {
    throw new Error('Failed to update post')
  }

  redirect(`/post/${postId}`)
}
