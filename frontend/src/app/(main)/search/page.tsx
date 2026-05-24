'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, UserCheck, UserPlus } from 'lucide-react'
import { followUser, getFollowRelations, getUsers, unfollowUser } from '@/lib/api'
import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { getInitial } from '@/lib/format'
import type { UserSummary } from '@/lib/types'

type FollowState = Record<string, boolean>

function UserAvatar ({ user }: { user: UserSummary }) {
  if (user.profileImage.length > 0) {
    return (
      <img
        src={user.profileImage}
        alt={`${user.username} 프로필`}
        className='size-10 shrink-0 rounded-full object-cover'
      />
    )
  }

  return (
    <div className='size-10 shrink-0 rounded-full bg-neutral-600 flex items-center justify-center text-sm font-semibold text-white'>
      {getInitial(user.username)}
    </div>
  )
}

export default function SearchPage () {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<UserSummary[]>([])
  const [following, setFollowing] = useState<FollowState>({})
  const [myId, setMyId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    Promise.resolve().then(async () => {
      const token = getAuthToken()
      const currentUserId = getUserIdFromToken(token)
      const userList = await getUsers()
      const nextFollowing: FollowState = {}

      if (currentUserId.length > 0) {
        const relations = await getFollowRelations(currentUserId)
        relations.following.forEach((user) => {
          nextFollowing[user._id] = true
        })
      }

      if (!mounted) return
      setMyId(currentUserId)
      setUsers(userList)
      setFollowing(nextFollowing)
      setError('')
    }).catch(() => {
      if (!mounted) return
      setError('사용자를 불러오지 못했습니다.')
    }).finally(() => {
      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [])

  const filteredUsers = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    const visibleUsers = users.filter((user) => user._id !== myId)
    if (keyword.length === 0) return visibleUsers

    return visibleUsers.filter((user) => {
      const bio = user.bio ?? ''
      return (
        user.username.toLowerCase().includes(keyword) ||
        (user.email ?? '').toLowerCase().includes(keyword) ||
        bio.toLowerCase().includes(keyword)
      )
    })
  }, [myId, query, users])

  async function handleFollowToggle (userId: string) {
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

  function renderUser (user: UserSummary) {
    const isFollowing = following[user._id] === true
    const Icon = isFollowing ? UserCheck : UserPlus

    return (
      <article key={user._id} className='flex items-center justify-between gap-3 py-4'>
        <Link href={`/profile/${user._id}`} className='flex min-w-0 flex-1 items-center gap-3'>
          <UserAvatar user={user} />
          <div className='min-w-0'>
            <p className='truncate text-[15px] font-semibold text-text-primary'>{user.username}</p>
            <p className='truncate text-[13px] text-text-muted'>{user.bio || user.email || 'Z 사용자'}</p>
          </div>
        </Link>
        <button
          type='button'
          onClick={() => {
            handleFollowToggle(user._id).catch(() => {})
          }}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-2 text-[12px] font-semibold transition-colors ${
            isFollowing ? 'text-text-muted hover:text-text-primary' : 'text-text-primary hover:bg-white/10'
          }`}
        >
          <Icon className='size-3.5' strokeWidth={2} aria-hidden='true' />
          {isFollowing ? '팔로잉' : '팔로우'}
        </button>
      </article>
    )
  }

  return (
    <main className='mx-auto min-h-full w-full max-w-155 px-4 lg:px-8'>
      <header className='sticky top-0 z-10 border-b border-border-subtle bg-bg/95 py-3 backdrop-blur'>
        <h1 className='text-[18px] font-bold text-text-primary'>탐색</h1>
        <label className='mt-3 flex h-11 items-center gap-2 rounded-xl border border-border-subtle bg-bg-soft px-3 text-text-muted focus-within:border-primary'>
          <Search className='size-4 shrink-0' strokeWidth={2} aria-hidden='true' />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='사용자 검색'
            className='min-w-0 flex-1 bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-muted'
          />
        </label>
      </header>

      <section aria-label='사용자 검색 결과' className='divide-y divide-border-subtle'>
        {loading
          ? <p className='py-10 text-center text-text-muted'>불러오는 중...</p>
          : error.length > 0
            ? <p className='py-10 text-center text-red-400'>{error}</p>
            : filteredUsers.length === 0
              ? <p className='py-10 text-center text-text-muted'>표시할 사용자가 없습니다.</p>
              : filteredUsers.map(renderUser)}
      </section>
    </main>
  )
}
