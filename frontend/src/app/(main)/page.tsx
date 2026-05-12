'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThreadComposer } from '@/components/ThreadComposer'
import { ThreadPost } from '@/components/ThreadPost'
import zIconSrc from '@assets/z-icon.png'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

type PostAuthor = {
  _id: string
  username: string
  profileImage: string
}

type Post = {
  _id: string
  author: PostAuthor
  content: string
  imageUrl: string
  likedBy: string[]
  commentCount: number
  createdAt: string
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}분`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간`
  const days = Math.floor(hours / 24)
  return `${days}일`
}

// JWT payload 중간 부분(Base64)만 decode해서 userId 꺼냄
function getUserIdFromToken(token: string): string {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload)).userId ?? ''
  } catch {
    return ''
  }
}

function LandingView() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-6 px-4'>
      <Image src={zIconSrc} className='h-12 w-auto' alt='Z' priority />
      <h1 className='text-2xl font-bold text-text-primary'>Z에 오신 것을 환영합니다</h1>
      <p className='text-text-muted'>지금 일어나고 있는 일을 확인해보세요.</p>
      <div className='flex w-full max-w-xs flex-col gap-3'>
        <Link
          href='/login'
          className='w-full rounded-full bg-primary py-3 text-center text-[15px] font-semibold text-white transition-opacity hover:opacity-80'
        >
          로그인
        </Link>
        <Link
          href='/register'
          className='w-full rounded-full border border-border-subtle py-3 text-center text-[15px] font-semibold text-text-primary transition-colors hover:bg-white/5'
        >
          회원가입
        </Link>
      </div>
    </div>
  )
}

function FeedView({ posts, userId, onPost }: { posts: Post[], userId: string, onPost: () => void }) {
  return (
    <div className='mx-auto min-h-full w-full max-w-155 px-0 lg:px-8'>
      <section className='min-w-0 sm:py-0'>
        <header className='sticky top-0 z-10 flex h-14 items-center border-b border-border-subtle bg-bg/95 px-4 backdrop-blur lg:hidden'>
          <h1 className='text-[18px] font-bold text-text-primary'>홈</h1>
        </header>
        <ThreadComposer onPost={onPost} />
        <section aria-label='Z 피드'>
          {posts.length === 0 ? (
            <p className='px-4 py-10 text-center text-text-muted'>게시글이 없습니다.</p>
          ) : (
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
                likedByMe={post.likedBy.includes(userId)}
                replyCount={post.commentCount.toString()}
                time={relativeTime(post.createdAt)}
              />
            ))
          )}
        </section>
      </section>
    </div>
  )
}

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('token')
    setToken(t)

    if (t) {
      setUserId(getUserIdFromToken(t))
      fetch(`${API_URL}/posts`, { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => setPosts(data.posts ?? []))
        .catch(() => {})
        .finally(() => setReady(true))
    } else {
      setReady(true)
    }
  }, [])

  function refreshPosts() {
    fetch(`${API_URL}/posts`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setPosts(data.posts ?? []))
      .catch(() => {})
  }

  if (!ready) return null

  if (!token) return <LandingView />

  return <FeedView posts={posts} userId={userId} onPost={refreshPosts} />
}
