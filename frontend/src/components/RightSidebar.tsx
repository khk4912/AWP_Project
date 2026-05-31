'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import UserAvatar from './UserAvatar'
import { followUser, unfollowUser } from '@/lib/api'
import type { UserSummary } from '@/lib/types'

const trends = [
  {
    category: 'Design',
    label: '#SFProDisplay',
    posts: '12.4K posts',
  },
  {
    category: 'Tech',
    label: '#iPhone17Pro',
    posts: '48.1K posts',
  },
  {
    category: 'Trending',
    label: '가천대',
    posts: '3,201 posts',
  },
  {
    category: 'Design',
    label: '#minimalism',
    posts: '8.9K posts',
  },
]

type RightSidebarProps = {
  currentUserId?: string
  initialFollowingIds: string[]
  users: UserSummary[]
}

export default function RightSidebar ({ currentUserId, initialFollowingIds, users }: RightSidebarProps) {
  const queryClient = useQueryClient()
  const [followingIds, setFollowingIds] = useState(() => new Set(initialFollowingIds))
  const followMutation = useMutation({
    mutationFn: async ({ targetUserId, following }: { targetUserId: string, following: boolean }) => {
      if (following) {
        await unfollowUser(targetUserId)
      } else {
        await followUser(targetUserId)
      }
      return { targetUserId, following }
    },
    onMutate: ({ targetUserId, following }) => {
      setFollowingIds((current) => {
        const next = new Set(current)
        if (following) {
          next.delete(targetUserId)
        } else {
          next.add(targetUserId)
        }
        return next
      })
    },
    onError: (_error, { targetUserId, following }) => {
      setFollowingIds((current) => {
        const next = new Set(current)
        if (following) {
          next.add(targetUserId)
        } else {
          next.delete(targetUserId)
        }
        return next
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] }).catch(() => {
        // Following feed refreshes when it refetches.
      })
    },
  })
  const recommendedUsers = users.filter((user) => user._id !== currentUserId).slice(0, 3)

  return (
    <aside className='sticky top-0 hidden h-screen w-80 shrink-0 overflow-y-auto border-l border-gray-100 bg-white px-6 py-4 xl:block'>
      <section className='mt-5 rounded-lg bg-gray-100 px-4 py-4'>
        <h2 className='text-xl font-bold text-gray-950'>당신을 위한 추천</h2>
        <div className='mt-4 divide-y divide-gray-200'>
          {trends.map((trend) => (
            <article key={trend.label} className='py-3 first:pt-0 last:pb-0'>
              <p className='text-sm text-gray-500'>{trend.category}</p>
              <h3 className='mt-1 text-base font-bold text-gray-950'>{trend.label}</h3>
              <p className='mt-1 text-sm text-gray-500'>{trend.posts}</p>
            </article>
          ))}
        </div>
      </section>

      <section className='mt-5 rounded-lg bg-gray-100 px-4 py-4'>
        <h2 className='text-xl font-bold text-gray-950'>추천 사용자</h2>
        <div className='mt-4 divide-y divide-gray-200'>
          {recommendedUsers.map((user) => {
            const isFollowing = followingIds.has(user._id)

            return (
              <article key={user._id} className='flex items-center gap-3 py-3 first:pt-0 last:pb-0'>
                <UserAvatar name={user.username} userId={user._id} seed={user._id} size={40} />
                <div className='min-w-0 flex-1'>
                  <h3 className='truncate text-sm font-bold text-gray-950'>{user.username}</h3>
                  <p className='truncate text-sm text-gray-500'>{user.email ?? user.bio ?? ''}</p>
                </div>
                <button
                  type='button'
                  disabled={currentUserId == null || followMutation.isPending}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60 ${isFollowing ? 'bg-white text-gray-950 ring-1 ring-gray-300 hover:bg-gray-50' : 'bg-gray-950 text-white hover:bg-gray-800'}`}
                  onClick={() => followMutation.mutate({ targetUserId: user._id, following: isFollowing })}
                >
                  {isFollowing ? '팔로잉' : '팔로우'}
                </button>
              </article>
            )
          })}
        </div>
      </section>

      <footer className='mt-5 px-1 text-xs text-gray-400'>
        © 2026 G
      </footer>
    </aside>
  )
}
