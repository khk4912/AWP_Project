import Post from '@/components/Post'
import type { Post as PostModel } from '@/lib/types'

type ProfilePostsProps = {
  currentUserId?: string
  posts: PostModel[]
}

export default function ProfilePosts ({ currentUserId, posts }: ProfilePostsProps) {
  return (
    <section aria-label='작성한 게시글'>
      <h2 className='border-b border-gray-100 px-4 py-3 text-base font-bold text-gray-950'>게시글</h2>
      {posts.length > 0
        ? posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            currentUserId={currentUserId}
            href={`/post/${post._id}`}
          />
        ))
        : <p className='px-4 py-8 text-center text-sm text-gray-500'>아직 작성한 게시글이 없습니다.</p>}
    </section>
  )
}
