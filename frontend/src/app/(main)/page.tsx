'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { RefreshCw } from 'lucide-react'
import { ThreadComposer } from '@/components/ThreadComposer'
import { ThreadPost } from '@/components/ThreadPost'
import { getFeedPosts, getPosts, isApiError } from '@/lib/api'
import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { likedByIncludes, relativeTime } from '@/lib/format'
import type { Post } from '@/lib/types'
import zIconSrc from '@assets/z-icon.png'

function SkeletonPost () {
  return (
    <div className='border-b border-border-subtle px-4 py-5 sm:px-0'>
      <div className='flex gap-3'>
        <div className='size-9 shrink-0 rounded-full bg-white/10 animate-pulse' />
        <div className='flex-1 space-y-2'>
          <div className='h-3 w-24 rounded-full bg-white/10 animate-pulse' />
          <div className='h-3 w-full rounded-full bg-white/10 animate-pulse' />
          <div className='h-3 w-3/4 rounded-full bg-white/10 animate-pulse' />
        </div>
      </div>
    </div>
  )
}

function LandingView () {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-6 px-4'>
      <Image src={zIconSrc} className='h-12 w-auto' alt='G' priority />
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

type Tab = 'all' | 'feed'

function FeedView ({ userId, token }: { userId: string; token: string }) {
  const [tab, setTab] = useState<Tab>('all')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [visible, setVisible] = useState(true)
  const [error, setError] = useState('')

  const fetchPosts = useCallback(async (nextTab: Tab, silent = false) => {
    if (silent) setRefreshing(true)
    else setLoading(true)
    setError('')

    try {
      const data = nextTab === 'feed' ? await getFeedPosts(token) : await getPosts()
      setPosts(data.posts)
    } catch (caughtError) {
      setError(isApiError(caughtError) ? caughtError.message : '피드를 불러오지 못했습니다.')
      setPosts([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [token])

  useEffect(() => {
    setVisible(false)
    const timer = window.setTimeout(() => {
      fetchPosts(tab)
        .then(() => setVisible(true))
        .catch(() => setVisible(true))
    }, 80)

    return () => window.clearTimeout(timer)
  }, [fetchPosts, tab])

  function handleTabChange (nextTab: Tab) {
    if (nextTab !== tab) setTab(nextTab)
  }

  return (
    <div className='mx-auto min-h-full w-full max-w-155 px-0 lg:px-8'>
      <section className='min-w-0'>
        <header className='sticky top-0 z-10 border-b border-border-subtle bg-bg/95 backdrop-blur'>
          <div className='flex h-14 items-center justify-between px-4'>
            <h1 className='text-[18px] font-bold text-text-primary'>홈</h1>
            <button
              type='button'
              aria-label='새로고침'
              onClick={() => {
                fetchPosts(tab, true).catch(() => {})
              }}
              className='inline-flex size-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary'
            >
              <RefreshCw className={`size-4 ${refreshing ? 'animate-spin' : ''}`} strokeWidth={2} />
            </button>
          </div>

          <div className='flex'>
            {(['all', 'feed'] as Tab[]).map((item) => (
              <button
                key={item}
                type='button'
                onClick={() => handleTabChange(item)}
                className={`relative flex-1 py-3 text-[15px] font-semibold transition-colors ${
                  tab === item ? 'text-text-primary' : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                }`}
              >
                {item === 'all' ? '전체' : '팔로우'}
                {tab === item && (
                  <span className='absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-primary' />
                )}
              </button>
            ))}
          </div>
        </header>

        <ThreadComposer
          onPost={() => {
            fetchPosts(tab, true).catch(() => {})
          }}
        />

        <section
          aria-label='Z 피드'
          className={`transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
          {loading
            ? (
              <>
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
              </>
              )
            : error.length > 0
              ? (
                <p className='px-4 py-10 text-center text-red-400'>{error}</p>
                )
              : posts.length === 0
                ? (
                  <p className='px-4 py-10 text-center text-text-muted'>
                    {tab === 'feed' ? '팔로우한 사람의 게시글이 없습니다.' : '게시글이 없습니다.'}
                  </p>
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
                        likedByMe={likedByIncludes(post, userId)}
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

export default function HomePage () {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true

    Promise.resolve().then(() => {
      if (!mounted) return

      const authToken = getAuthToken()
      setToken(authToken)
      setUserId(getUserIdFromToken(authToken))
      setReady(true)
    }).catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  if (!ready) return null
  if (token == null) return <LandingView />

  return <FeedView userId={userId} token={token} />
}
