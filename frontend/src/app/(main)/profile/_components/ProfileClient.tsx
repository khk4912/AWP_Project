'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import Link from 'next/link'

import UserAvatar from '@/components/UserAvatar'
import { followUser, unfollowUser } from '@/lib/api'
import type { FollowRelations, UserProfile, UserSummary } from '@/lib/types'

type ProfileClientProps = {
  currentUserId?: string
  profile: UserProfile
  relations: FollowRelations | null
}

type RelationModal = 'followers' | 'following' | null

const relationLabels = {
  followers: '팔로워',
  following: '팔로잉',
}

function RelationListModal ({
  count,
  onClose,
  type,
  users,
}: {
  count: number
  onClose: () => void
  type: Exclude<RelationModal, null>
  users: UserSummary[]
}) {
  const title = relationLabels[type]

  useEffect(() => {
    function handleKeyDown (event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className='fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-3 pb-3 pt-16 sm:items-center sm:p-6'
      role='presentation'
      onClick={onClose}
    >
      <div
        className='max-h-[80vh] w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl'
        role='dialog'
        aria-modal='true'
        aria-labelledby='profile-relation-modal-title'
        onClick={(event) => event.stopPropagation()}
      >
        <header className='flex h-14 items-center justify-between border-b border-gray-200 px-4'>
          <button
            type='button'
            aria-label='닫기'
            className='inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 hover:text-gray-950'
            onClick={onClose}
          >
            <XIcon className='h-5 w-5' />
          </button>
          <h2 id='profile-relation-modal-title' className='text-base font-bold text-gray-950'>
            {title}
          </h2>
          <span className='h-9 min-w-9 text-right text-sm font-medium leading-9 text-gray-500'>{count}</span>
        </header>

        <div className='max-h-[calc(80vh-3.5rem)] overflow-y-auto'>
          {users.length > 0
            ? (
              <div className='divide-y divide-gray-100'>
                {users.map((user) => (
                  <Link
                    key={user._id}
                    href={`/profile/${user._id}`}
                    className='flex items-center gap-3 px-4 py-4 hover:bg-gray-50'
                    onClick={onClose}
                  >
                    <UserAvatar name={user.username} seed={user._id} size={44} noHref />
                    <div className='min-w-0 flex-1'>
                      <h3 className='truncate text-base font-bold text-gray-950'>{user.username}</h3>
                      <p className='truncate text-sm text-gray-500'>{user.email ?? user.bio ?? ''}</p>
                    </div>
                  </Link>
                ))}
              </div>
              )
            : <p className='px-4 py-8 text-center text-sm text-gray-500'>표시할 사용자가 없습니다.</p>}
        </div>
      </div>
    </div>
  )
}

export default function ProfileClient ({ currentUserId, profile, relations }: ProfileClientProps) {
  const queryClient = useQueryClient()
  const isOwnProfile = currentUserId === profile._id
  const [activeRelationModal, setActiveRelationModal] = useState<RelationModal>(null)
  const [isFollowing, setIsFollowing] = useState(() => (
    relations?.followers.some((user) => user._id === currentUserId) ?? false
  ))
  const [followerCount, setFollowerCount] = useState(relations?.followerCount ?? profile.followers?.length ?? 0)
  const followingUsers = relations?.following ?? profile.following ?? []
  const followerUsers = relations?.followers ?? profile.followers ?? []
  const followingCount = relations?.followingCount ?? profile.following?.length ?? 0
  const modalUsers = activeRelationModal === 'following' ? followingUsers : followerUsers
  const modalCount = activeRelationModal === 'following' ? followingCount : followerCount
  const followMutation = useMutation({
    mutationFn: async ({ following }: { following: boolean }) => {
      if (following) {
        await unfollowUser(profile._id)
      } else {
        await followUser(profile._id)
      }
    },
    onMutate: ({ following }) => {
      setIsFollowing(!following)
      setFollowerCount((count) => Math.max(0, count + (following ? -1 : 1)))
    },
    onError: (_error, { following }) => {
      setIsFollowing(following)
      setFollowerCount((count) => Math.max(0, count + (following ? 1 : -1)))
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
              onClick={() => followMutation.mutate({ following: isFollowing })}
            >
              {followMutation.isPending ? '처리 중' : isFollowing ? '팔로잉' : '팔로우'}
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
          <dd>
            <button
              type='button'
              className='cursor-pointer rounded-full hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              onClick={() => setActiveRelationModal('following')}
            >
              <strong>{followingCount}</strong> 팔로잉
            </button>
          </dd>
        </div>
        <div>
          <dt className='sr-only'>팔로워</dt>
          <dd>
            <button
              type='button'
              className='cursor-pointer rounded-full hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              onClick={() => setActiveRelationModal('followers')}
            >
              <strong>{followerCount}</strong> 팔로워
            </button>
          </dd>
        </div>
      </dl>
      {followMutation.isError
        ? <p className='mt-3 text-sm font-medium text-red-500'>팔로우 상태를 변경하지 못했습니다.</p>
        : null}
      {activeRelationModal != null
        ? (
          <RelationListModal
            count={modalCount}
            type={activeRelationModal}
            users={modalUsers}
            onClose={() => setActiveRelationModal(null)}
          />
          )
        : null}
    </div>
  )
}
