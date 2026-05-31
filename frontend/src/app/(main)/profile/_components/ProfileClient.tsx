'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import UserAvatar from '@/components/UserAvatar'
import { followUser, unfollowUser } from '@/lib/api'
import type { FollowRelations, UserProfile } from '@/lib/types'

type ProfileClientProps = {
  currentUserId?: string
  profile: UserProfile
  relations: FollowRelations | null
}

export default function ProfileClient ({ currentUserId, profile, relations }: ProfileClientProps) {
  const queryClient = useQueryClient()
  const isOwnProfile = currentUserId === profile._id
  const [isFollowing, setIsFollowing] = useState(() => (
    relations?.followers.some((user) => user._id === currentUserId) ?? false
  ))
  const [followerCount, setFollowerCount] = useState(relations?.followerCount ?? profile.followers?.length ?? 0)
  const followMutation = useMutation({
    mutationFn: async () => {
      if (isFollowing) {
        await unfollowUser(profile._id)
      } else {
        await followUser(profile._id)
      }
    },
    onMutate: () => {
      setIsFollowing((value) => !value)
      setFollowerCount((count) => count + (isFollowing ? -1 : 1))
    },
    onError: () => {
      setIsFollowing((value) => !value)
      setFollowerCount((count) => count + (isFollowing ? 1 : -1))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] }).catch(() => {
        // Following feed refreshes when it refetches.
      })
    },
  })

  return (
    <div className='border-b border-gray-200 px-4 py-6'>
      <div className='flex items-start justify-between gap-4'>
        <UserAvatar name={profile.username} seed={profile._id} size={72} />
        {!isOwnProfile && currentUserId != null && currentUserId.length > 0
          ? (
            <button
              type='button'
              disabled={followMutation.isPending}
              className={`rounded-full px-5 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60 ${isFollowing ? 'bg-white text-gray-950 ring-1 ring-gray-300 hover:bg-gray-50' : 'bg-gray-950 text-white hover:bg-gray-800'}`}
              onClick={() => followMutation.mutate()}
            >
              {isFollowing ? '팔로잉' : '팔로우'}
            </button>
            )
          : null}
      </div>

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
          <dd><strong>{followerCount}</strong> 팔로워</dd>
        </div>
      </dl>
    </div>
  )
}
