'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ThreadPost } from '@/components/ThreadPost'
import {
  followUser,
  getFollowRelations,
  getPosts,
  getUser,
  unfollowUser
} from '@/lib/api'
import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { getInitial, likedByIncludes, relativeTime } from '@/lib/format'
import type { Post, UserProfile } from '@/lib/types'

export default function ProfilePage () {
  const { id } = useParams<{ id: string }>()
  const [myId, setMyId] = useState('')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')

  const loadProfile = useCallback(async () => {
    setReady(false)
    setError('')

    const token = getAuthToken()
    const currentUserId = getUserIdFromToken(token)
    setMyId(currentUserId)

    try {
      const [userData, followData, postData] = await Promise.all([
        getUser(id),
        getFollowRelations(id),
        getPosts({ limit: 100 })
      ])
      setUser(userData)
      setFollowerCount(followData.followerCount)
      setFollowingCount(followData.followingCount)
      setIsFollowing(followData.followers.some((follower) => follower._id === currentUserId))
      setPosts(postData.posts.filter((post) => post.author._id === id))
    } catch {
      setError('프로필을 불러오지 못했습니다.')
      setUser(null)
      setPosts([])
    } finally {
      setReady(true)
    }
  }, [id])

  useEffect(() => {
    let mounted = true

    Promise.resolve().then(async () => {
      if (!mounted) return
      await loadProfile()
    }).catch(() => {})

    return () => {
      mounted = false
    }
  }, [loadProfile])

  async function handleFollow () {
    const token = getAuthToken()
    if (token == null) return

    const nextFollowing = !isFollowing
    const nextFollowerCount = isFollowing ? Math.max(0, followerCount - 1) : followerCount + 1
    setIsFollowing(nextFollowing)
    setFollowerCount(nextFollowerCount)

    try {
      if (isFollowing) await unfollowUser(token, id)
      else await followUser(token, id)
    } catch {
      setIsFollowing(isFollowing)
      setFollowerCount(followerCount)
    }
  }

  if (!ready) return null

  if (error.length > 0 || user == null) {
    return <p className='p-8 text-text-muted'>{error || '유저를 찾을 수 없습니다.'}</p>
  }

  const isMyProfile = myId === id

  return (
    <div className='mx-auto min-h-full w-full max-w-155 px-4 lg:px-8'>
      <header className='sticky top-0 z-10 flex h-14 items-center border-b border-border-subtle bg-bg/95 backdrop-blur lg:hidden'>
        <h1 className='truncate text-[18px] font-bold text-text-primary'>{user.username}</h1>
      </header>

      <div className='py-6'>
        <div className='flex items-start gap-4'>
          {user.profileImage.length > 0
            ? (
              <img
                src={user.profileImage}
                alt={user.username}
                className='size-20 shrink-0 rounded-full object-cover'
              />
              )
            : (
              <div className='size-20 shrink-0 rounded-full bg-neutral-600 flex items-center justify-center text-2xl font-bold text-white'>
                {getInitial(user.username)}
              </div>
              )}

          <div className='min-w-0 flex-1'>
            <h2 className='truncate text-xl font-bold text-text-primary'>{user.username}</h2>
            {user.bio != null && user.bio.length > 0
              ? <p className='mt-1 break-words text-[14px] text-text-muted'>{user.bio}</p>
              : null}
            <div className='mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[14px]'>
              <span className='text-text-primary'>
                <span className='font-semibold'>{posts.length}</span>
                <span className='ml-1 text-text-muted'>게시물</span>
              </span>
              <span className='text-text-primary'>
                <span className='font-semibold'>{followerCount}</span>
                <span className='ml-1 text-text-muted'>팔로워</span>
              </span>
              <span className='text-text-primary'>
                <span className='font-semibold'>{followingCount}</span>
                <span className='ml-1 text-text-muted'>팔로잉</span>
              </span>
            </div>
          </div>
        </div>

        <div className='mt-4'>
          {isMyProfile
            ? (
              <button
                type='button'
                disabled
                className='w-full rounded-xl border border-border-subtle py-2 text-[14px] font-semibold text-text-muted opacity-70'
              >
                프로필 편집 준비 중
              </button>
              )
            : (
              <button
                type='button'
                onClick={() => {
                  handleFollow().catch(() => {})
                }}
                className={`w-full rounded-xl py-2 text-[14px] font-semibold transition-colors ${
                  isFollowing
                    ? 'border border-border-subtle text-text-primary hover:bg-white/5'
                    : 'bg-primary text-white hover:opacity-80'
                }`}
              >
                {isFollowing ? '팔로잉' : '팔로우'}
              </button>
              )}
        </div>
      </div>

      <div className='border-t border-border-subtle'>
        {posts.length === 0
          ? (
            <p className='py-10 text-center text-text-muted'>게시글이 없습니다.</p>
            )
          : (
              posts.map((post) => (
                <ThreadPost
                  key={post._id}
                  postId={post._id}
                  authorId={post.author._id}
                  author={post.author.username}
                  avatarUrl={post.author.profileImage}
                  content={post.content}
                  imageUrl={post.imageUrl || undefined}
                  likeCount={post.likedBy.length}
                  likedByMe={likedByIncludes(post, myId)}
                  replyCount={(post.commentCount ?? 0).toString()}
                  time={relativeTime(post.createdAt)}
                />
              ))
            )}
      </div>
    </div>
  )
}
