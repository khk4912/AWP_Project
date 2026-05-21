'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

function getUserIdFromToken(token: string): string {
  try {
    return JSON.parse(atob(token.split('.')[1])).userId ?? ''
  } catch {
    return ''
  }
}

export default function ProfilePage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    const userId = getUserIdFromToken(token)
    if (userId) router.push(`/profile/${userId}`)
  }, [router])

  return null
}
