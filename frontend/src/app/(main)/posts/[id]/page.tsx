'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ThreadPost } from '@/components/ThreadPost'
import { getPost, isApiError } from '@/lib/api'
import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { likedByIncludes, relativeTime } from '@/lib/format'
import type { Post } from '@/lib/types'

export default function PostDetailPage () {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [myId, setMyId] = useState('')
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')

  const loadPost = useCallback(async () => {
    setReady(false)
    setError('')
    setMyId(getUserIdFromToken(getAuthToken()))

    try {
      const data = await getPost(id)
      setPost(data)
    } catch (caughtError) {
      setPost(null)
      setError(isApiError(caughtError) && caughtError.statusCode === 404
        ? '게시글을 찾을 수 없습니다.'
        : '게시글을 불러오지 못했습니다.')
    } finally {
      setReady(true)
    }
  }, [id])

  useEffect(() => {
    let mounted = true

    Promise.resolve().then(async () => {
      if (!mounted) return
      await loadPost()
    }).catch(() => {})

    return () => {
      mounted = false
    }
  }, [loadPost])

  if (!ready) return null

  if (error.length > 0 || post == null) {
    return <p className='p-8 text-text-muted'>{error || '게시글을 찾을 수 없습니다.'}</p>
  }

  return (
    <div className='mx-auto min-h-full w-full max-w-155 px-0 lg:px-8'>
      <header className='sticky top-0 z-10 flex h-14 items-center border-b border-border-subtle bg-bg/95 px-4 backdrop-blur'>
        <h1 className='text-[18px] font-bold text-text-primary'>게시글</h1>
      </header>

      <ThreadPost
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
        initialCommentsOpen
        enableDetailLink={false}
        allowEdit
      />
    </div>
  )
}
