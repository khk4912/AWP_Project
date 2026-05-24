'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { followUser, getFollowRelations, getUser, getUsers, unfollowUser } from '@/lib/api'
import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { getInitial } from '@/lib/format'
import type { UserSummary } from '@/lib/types'

type FollowState = Record<string, boolean>

function UserAvatar ({ user, sizeClass }: { user: UserSummary; sizeClass: string }) {
  if (user.profileImage.length > 0) {
    return (
      <img
        src={user.profileImage}
        alt={`${user.username} 프로필`}
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
      />
    )
  }

  return (
    <div className={`${sizeClass} shrink-0 rounded-full bg-neutral-600 flex items-center justify-center text-sm font-semibold text-white`}>
      {getInitial(user.username)}
    </div>
  )
}

function SuggestedUserRow ({
  isFollowing,
  onToggle,
  user
}: {
  isFollowing: boolean
  onToggle: () => void
  user: UserSummary
}) {
  return (
    <li className='flex items-center justify-between gap-3'>
      <Link href={`/profile/${user._id}`} className='flex min-w-0 items-center gap-3'>
        <UserAvatar user={user} sizeClass='size-[38px]' />
        <div className='min-w-0'>
          <p className='truncate text-[14px] font-semibold text-text-primary'>{user.username}</p>
          <p className='truncate text-[12px] text-text-muted'>{user.bio || user.email || '추천 사용자'}</p>
        </div>
      </Link>
      <button
        type='button'
        onClick={onToggle}
        className={`shrink-0 rounded-lg border border-[#323232] px-4 py-2 text-[12px] font-semibold transition-colors ${
          isFollowing
            ? 'text-text-muted hover:text-text-primary'
            : 'text-text-primary hover:bg-white/10'
        }`}
      >
        {isFollowing ? '팔로잉' : '팔로우'}
      </button>
    </li>
  )
}

export function RightRail () {
  const [me, setMe] = useState<UserSummary | null>(null)
  const [users, setUsers] = useState<UserSummary[]>([])
  const [following, setFollowing] = useState<FollowState>({})
  const [myId, setMyId] = useState('')

  useEffect(() => {
    let mounted = true

    Promise.resolve().then(async () => {
      const token = getAuthToken()
      const currentUserId = getUserIdFromToken(token)
      if (currentUserId.length === 0) return

      const [currentUser, userList, relations] = await Promise.all([
        getUser(currentUserId),
        getUsers(),
        getFollowRelations(currentUserId)
      ])
      const nextFollowing: FollowState = {}
      relations.following.forEach((user) => {
        nextFollowing[user._id] = true
      })

      if (!mounted) return
      setMyId(currentUserId)
      setMe(currentUser)
      setUsers(userList)
      setFollowing(nextFollowing)
    }).catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  const suggestions = useMemo(
    () => users.filter((user) => user._id !== myId).slice(0, 4),
    [myId, users]
  )

  async function handleToggleFollow (userId: string) {
    const token = getAuthToken()
    if (token == null) return

    const isFollowing = following[userId] === true
    setFollowing((current) => ({ ...current, [userId]: !isFollowing }))

    try {
      if (isFollowing) await unfollowUser(token, userId)
      else await followUser(token, userId)
    } catch {
      setFollowing((current) => ({ ...current, [userId]: isFollowing }))
    }
  }

  return (
    <aside className='hidden w-64 shrink-0 py-[50px] pr-6 xl:block'>
      <div className='sticky top-[50px] flex flex-col gap-8'>
        {me != null
          ? (
            <section className='flex items-center justify-between'>
              <Link href={`/profile/${me._id}`} className='flex min-w-0 items-center gap-3'>
                <UserAvatar user={me} sizeClass='size-[38px]' />
                <div className='min-w-0'>
                  <p className='truncate text-[14px] font-semibold text-text-primary'>{me.username}</p>
                  <p className='truncate text-[13px] text-text-muted'>{me.email ?? '내 프로필'}</p>
                </div>
              </Link>
            </section>
            )
          : null}

        <section>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-[14px] font-semibold text-text-muted'>추천 사용자</h2>
            <Link href='/search' className='text-[12px] font-semibold text-text-primary hover:text-white'>
              모두 보기
            </Link>
          </div>
          {suggestions.length === 0
            ? <p className='text-[13px] leading-5 text-text-muted'>사용자를 찾으면 여기에 표시됩니다.</p>
            : (
              <ul className='flex flex-col gap-4'>
                {suggestions.map((user) => (
                  <SuggestedUserRow
                    key={user._id}
                    user={user}
                    isFollowing={following[user._id] === true}
                    onToggle={() => {
                      handleToggleFollow(user._id).catch(() => {})
                    }}
                  />
                ))}
              </ul>
              )}
        </section>

        <footer className='space-y-4 text-[11px] leading-5 text-text-muted'>
          <p>소개 · 도움말 · 개인정보 · 약관</p>
          <p>© 2026 Z</p>
        </footer>
      </div>
    </aside>
  )
}
