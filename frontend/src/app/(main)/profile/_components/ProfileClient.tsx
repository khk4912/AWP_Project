'use client'

import { useEffect, useState } from 'react'

import UserAvatar from '@/components/UserAvatar'
import { getFollowRelations, getUser } from '@/lib/api'
import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import type { FollowRelations, UserProfile } from '@/lib/types'

export default function ProfileClient () {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [relations, setRelations] = useState<FollowRelations | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const token = getAuthToken()
  const userId = getUserIdFromToken(token)

  useEffect(() => {
    async function loadProfile () {
      if (userId.length === 0) return

      try {
        const [profileResponse, relationsResponse] = await Promise.all([
          getUser(userId),
          getFollowRelations(userId),
        ])
        setProfile(profileResponse)
        setRelations(relationsResponse)
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '프로필을 불러오지 못했습니다.')
      }
    }

    loadProfile().catch((error: unknown) => {
      setErrorMessage(error instanceof Error ? error.message : '프로필을 불러오지 못했습니다.')
    })
  }, [userId])

  if (token == null || userId.length === 0) {
    return (
      <div className='flex min-h-[240px] items-center justify-center px-6 text-center text-gray-500'>
        로그인 후 프로필을 확인할 수 있습니다.
      </div>
    )
  }

  if (errorMessage.length > 0) {
    return (
      <div className='flex min-h-[240px] items-center justify-center px-6 text-center text-gray-500'>
        {errorMessage}
      </div>
    )
  }

  if (profile == null) {
    return (
      <div className='flex min-h-[240px] items-center justify-center px-6 text-center text-gray-500'>
        프로필을 불러오는 중입니다.
      </div>
    )
  }

  return (
    <div className='border-b border-gray-200 px-4 py-6'>
      <UserAvatar name={profile.username} seed={profile._id} size={72} />
      <div className='mt-4'>
        <h2 className='text-xl font-bold text-gray-950'>{profile.username}</h2>
        <p className='text-sm text-gray-500'>{profile.email ?? '@you'}</p>
        {profile.bio != null && profile.bio.length > 0
          ? <p className='mt-3 whitespace-pre-wrap text-gray-950'>{profile.bio}</p>
          : null}
      </div>
      <dl className='mt-4 flex gap-5 text-sm'>
        <div>
          <dt className='sr-only'>팔로잉</dt>
          <dd><strong>{relations?.followingCount ?? profile.following?.length ?? 0}</strong> 팔로잉</dd>
        </div>
        <div>
          <dt className='sr-only'>팔로워</dt>
          <dd><strong>{relations?.followerCount ?? profile.followers?.length ?? 0}</strong> 팔로워</dd>
        </div>
      </dl>
    </div>
  )
}
