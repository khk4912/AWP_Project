import { notFound } from 'next/navigation'

import Post from '@/components/Post'
import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { mockComments } from '@/lib/mock'
import { getPost } from '@/lib/server/api'
import type { Post as PostModel } from '@/lib/types'

import CommentSection from './_components/CommentSection'
import ScrollToTop from './_components/ScrollToTop'

type PostPageProps = {
  params: Promise<{
    postId: string
  }>
}

export default async function PostPage ({ params }: PostPageProps) {
  const { postId } = await params
  let post: PostModel

  try {
    post = await getPost(postId)
  } catch {
    notFound()
  }

  const token = await getAuthToken()
  const currentUserId = getUserIdFromToken(token)
  const comments = mockComments.filter((comment) => comment.post === post._id)

  return (
    <div className='min-h-screen max-w-2xl border-x border-gray-200 bg-white pt-16 md:pt-0
                    flex-row'
    >
      <ScrollToTop />
      <Post post={post} currentUserId={currentUserId} inDetailView />
      <CommentSection comments={comments} />
    </div>

  )
}
