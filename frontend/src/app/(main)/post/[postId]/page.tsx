import { notFound } from 'next/navigation'

import { getComments, getPost, isApiError } from '@/lib/api'
import type { Comment, Post as PostModel } from '@/lib/types'
import PostDetailClient from './_components/PostDetailClient'

type PostDetailPageProps = {
  params: Promise<{
    postId: string
  }>
}

async function getPostDetail (postId: string): Promise<{
  post: PostModel
  comments: Comment[]
}> {
  try {
    const [post, comments] = await Promise.all([
      getPost(postId),
      getComments(postId),
    ])

    return { post, comments }
  } catch (error) {
    if (isApiError(error) && error.statusCode === 404) {
      notFound()
    }

    throw error
  }
}

export default async function PostDetailPage ({ params }: PostDetailPageProps) {
  const { postId } = await params
  const { post, comments } = await getPostDetail(postId)

  return (
    <section className='min-h-screen max-w-2xl border-x border-gray-200 bg-white pt-16 md:pt-0'>
      <header className='sticky top-16 z-10 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur md:top-0'>
        <h1 className='text-lg font-bold text-gray-950'>게시글</h1>
      </header>

      <PostDetailClient post={post} comments={comments} />
    </section>
  )
}
