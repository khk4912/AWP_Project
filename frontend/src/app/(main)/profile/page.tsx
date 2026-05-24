'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthToken, getUserIdFromToken } from '@/lib/auth'

export default function ProfilePage () {
  const router = useRouter()

  useEffect(() => {
    Promise.resolve().then(() => {
      const token = getAuthToken()
      if (token == null) {
        router.push('/login')
        return
      }

      const userId = getUserIdFromToken(token)
      router.push(userId.length > 0 ? `/profile/${userId}` : '/login')
    }).catch(() => {})
  }, [router])

  return null
}
