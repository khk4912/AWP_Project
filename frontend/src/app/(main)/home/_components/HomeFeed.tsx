'use client'

import { useCallback, useEffect, useState } from 'react'

import Post from '@/components/Post'
import { getFeedPosts, getPosts, likePost, unlikePost } from '@/lib/api'
import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { likedByIncludes } from '@/lib/format'
import type { Post as PostModel } from '@/lib/types'

import type { FeedTab } from './FeedTabs'
import { POST_CREATED_EVENT } from './PostComposer'

type HomeFeedProps = {
  activeTab: FeedTab
}

export default function HomeFeed ({ activeTab }: HomeFeedProps) {
  const [posts, setPosts] = useState<PostModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const token = getAuthToken()
  const currentUserId = getUserIdFromToken(token)

  const loadPosts = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = activeTab === 'following' && token != null
        ? await getFeedPosts(token, { limit: 20 })
        : await getPosts({ limit: 20, token })

      setPosts(response.posts)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '게시글을 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, token])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadPosts().catch((error: unknown) => {
        setErrorMessage(error instanceof Error ? error.message : '게시글을 불러오지 못했습니다.')
        setIsLoading(false)
      })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadPosts])

  useEffect(() => {
    function handlePostCreated () {
      loadPosts().catch((error: unknown) => {
        setErrorMessage(error instanceof Error ? error.message : '게시글을 불러오지 못했습니다.')
        setIsLoading(false)
      })
    }

    window.addEventListener(POST_CREATED_EVENT, handlePostCreated)
    return () => window.removeEventListener(POST_CREATED_EVENT, handlePostCreated)
  }, [loadPosts])

  async function handleLike (post: PostModel) {
    if (token == null || currentUserId.length === 0) return

    const isLiked = likedByIncludes(post, currentUserId)

    try {
      if (isLiked) {
        await unlikePost(token, post._id)
      } else {
        await likePost(token, post._id)
      }

      setPosts((currentPosts) => currentPosts.map((currentPost) => {
        if (currentPost._id !== post._id) return currentPost

        return {
          ...currentPost,
          likedBy: isLiked
            ? currentPost.likedBy.filter((likedBy) => {
              if (typeof likedBy === 'string') return likedBy !== currentUserId
              return likedBy._id !== currentUserId
            })
            : [...currentPost.likedBy, currentUserId],
        }
      }))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '좋아요 상태를 변경하지 못했습니다.')
    }
  }

  if (isLoading) {
    return (
      <div className='flex min-h-[240px] items-center justify-center px-6 text-center text-gray-500'>
        게시글을 불러오는 중입니다.
      </div>
    )
  }

  if (errorMessage.length > 0) {
    return (
      <div className='flex min-h-[240px] items-center justify-center px-6 text-center text-gray-500'>
        {errorMessage}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className='flex min-h-[240px] items-center justify-center px-6 text-center text-gray-500'>
        표시할 게시글이 없습니다.
      </div>
    )
  }

  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post._id}
          post={post}
          currentUserId={currentUserId}
          href={`/post/${post._id}`}
          onLike={(postToLike) => {
            handleLike(postToLike).catch((error: unknown) => {
              setErrorMessage(error instanceof Error ? error.message : '좋아요 상태를 변경하지 못했습니다.')
            })
          }}
        />
      ))}
    </div>
  )
}
