'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ThreadPost } from '@/components/ThreadPost'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

type UserProfile = {
  _id: string
  username: string
  profileImage: string
  bio: string
}

type Post = {
  _id: string
  author: { _id: string; username: string; profileImage: string }
  content: string
  imageUrl: string
  likedBy: string[]
  commentCount: number
  createdAt: string
}

function relativeTime (dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}분`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간`
  const days = Math.floor(hours / 24)
  return `${days}일`
}

function getUserIdFromToken (token: string): string {
  try {
    return JSON.parse(atob(token.split('.')[1])).userId ?? ''
  } catch {
    return ''
  }
}

export default function ProfilePage () {
  const { id } = useParams<{ id: string }>()
  const [myId, setMyId] = useState('')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const me = token ? getUserIdFromToken(token) : ''
    setMyId(me)

    Promise.all([
      fetch(`${API_URL}/users/${id}`).then((r) => r.json()),
      fetch(`${API_URL}/follow/${id}`).then((r) => r.json()),
      fetch(`${API_URL}/posts?limit=100`).then((r) => r.json()),
    ])
      .then(([userData, followData, postData]) => {
        setUser(userData)
        setFollowerCount(followData.followerCount ?? 0)
        setFollowingCount(followData.followingCount ?? 0)
        setIsFollowing(
          followData.followers?.some((f: { _id: string }) => f._id === me) ?? false
        )
        const myPosts = (postData.posts ?? []).filter(
          (p: Post) => p.author._id === id
        )
        setPosts(myPosts)
      })
      .catch(() => {})
      .finally(() => setReady(true))
  }, [id])

  async function handleFollow () {
    const token = localStorage.getItem('token')
    if (!token) return

    const endpoint = isFollowing ? 'follow/unfollow' : 'follow'
    setIsFollowing(!isFollowing)
    setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1)

    await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUserId: id }),
    }).catch(() => {
      setIsFollowing(isFollowing)
      setFollowerCount(followerCount)
    })
  }

  if (!ready) return null
  if (!user) return <p className='p-8 text-text-muted'>유저를 찾을 수 없습니다.</p>

  const isMyProfile = myId === id

  return (
    <div className='mx-auto min-h-full w-full max-w-155 px-4 lg:px-8'>
      <header className='sticky top-0 z-10 flex h-14 items-center border-b border-border-subtle bg-bg/95 backdrop-blur lg:hidden'>
        <h1 className='text-[18px] font-bold text-text-primary'>{user.username}</h1>
      </header>

      {/* 프로필 정보 */}
      <div className='py-6'>
        <div className='flex items-start gap-4'>
          {user.profileImage
            ? (
              <img
                src={user.profileImage}
                alt={user.username}
                className='size-20 rounded-full object-cover'
              />
              )
            : (
              <div className='size-20 rounded-full bg-neutral-600 flex items-center justify-center text-2xl font-bold text-white'>
                {user.username[0]?.toUpperCase()}
              </div>
              )}

          <div className='flex-1'>
            <h2 className='text-xl font-bold text-text-primary'>{user.username}</h2>
            {user.bio && (
              <p className='mt-1 text-[14px] text-text-muted'>{user.bio}</p>
            )}
            <div className='mt-3 flex gap-4 text-[14px]'>
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

        {/* 버튼 */}
        <div className='mt-4'>
          {isMyProfile
            ? (
              <button
                type='button'
                className='w-full rounded-xl border border-border-subtle py-2 text-[14px] font-semibold text-text-primary transition-colors hover:bg-white/5'
              >
                프로필 편집
              </button>
              )
            : (
              <button
                type='button'
                onClick={handleFollow}
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

      {/* 게시글 목록 */}
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
                  likedByMe={post.likedBy.includes(myId)}
                  replyCount={post.commentCount.toString()}
                  time={relativeTime(post.createdAt)}
                />
              ))
            )}
      </div>
    </div>
  )
}
