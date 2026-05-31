'use client'

import { useState } from 'react'

import Post from '@/components/Post'
import type { Comment, Post as PostModel } from '@/lib/types'

import CommentSection from './CommentSection'

type PostDetailProps = {
  comments: Comment[]
  currentUserId: string
  post: PostModel
}

export default function PostDetail ({ comments, currentUserId, post }: PostDetailProps) {
  const [commentCount, setCommentCount] = useState(post.commentCount ?? comments.length)
  const postWithCommentCount = {
    ...post,
    commentCount,
  }

  return (
    <>
      <Post post={postWithCommentCount} currentUserId={currentUserId} inDetailView />
      <CommentSection
        comments={comments}
        currentUserId={currentUserId}
        postId={post._id}
        onCommentCountDelta={(delta) => setCommentCount((count) => Math.max(0, count + delta))}
      />
    </>
  )
}
