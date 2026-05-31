import { notFound } from 'next/navigation'

import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { getComments, getPost } from '@/lib/server/api'
import type { Post as PostModel } from '@/lib/types'

import PostDetail from './_components/PostDetail'
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
  const comments = await getComments(post._id)

  return (
    <div className='min-h-screen max-w-2xl border-x border-gray-200 bg-white pt-16 md:pt-0
                    flex-row'
    >
      <ScrollToTop />
      <PostDetail comments={comments} currentUserId={currentUserId} post={post} />
    </div>

  )
}
