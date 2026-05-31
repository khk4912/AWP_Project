import Post from '@/components/Post'
import { mockComments, mockPosts } from '@/lib/mock'

import CommentSection from './_components/CommentSection'

type PostPageProps = {
  params: Promise<{
    postId: string
  }>
}

export default async function PostPage ({ params }: PostPageProps) {
  const { postId } = await params
  const post = mockPosts.find((item) => item._id === postId) ?? mockPosts[0]
  const comments = mockComments.filter((comment) => comment.post === post._id)

  return (
    <div className='min-h-screen max-w-2xl border-x border-gray-200 bg-white pt-16 md:pt-0
                    flex-row'
    >
      <Post post={post} inDetailView />
      <CommentSection comments={comments} />
    </div>

  )
}
