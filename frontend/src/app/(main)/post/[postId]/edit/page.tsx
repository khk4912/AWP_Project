import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { getPost } from '@/lib/server/api'

import { updatePostAction } from './actions'

type EditPostPageProps = {
  params: Promise<{
    postId: string
  }>
}

export default async function EditPostPage ({ params }: EditPostPageProps) {
  const { postId } = await params
  const [post, token] = await Promise.all([
    getPost(postId),
    getAuthToken(),
  ])
  const currentUserId = getUserIdFromToken(token)

  if (currentUserId !== post.author._id) notFound()

  return (
    <section className='min-h-screen max-w-2xl border-x border-gray-200 bg-white pt-16 md:pt-0'>
      <header className='border-b border-gray-200 px-4 py-4'>
        <h1 className='text-lg font-bold text-gray-950'>게시글 수정</h1>
      </header>

      <form action={updatePostAction} className='px-4 py-5'>
        <input type='hidden' name='postId' value={post._id} />
        <textarea
          name='content'
          defaultValue={post.content}
          required
          rows={8}
          className='min-h-40 w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-base leading-6 text-gray-950 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
        />

        <div className='mt-4 flex justify-end gap-2'>
          <Link
            href={`/post/${post._id}`}
            className='rounded-full px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100'
          >
            취소
          </Link>
          <button
            type='submit'
            className='rounded-full bg-blue-500 px-5 py-2 text-sm font-bold text-white hover:bg-blue-600'
          >
            저장
          </button>
        </div>
      </form>
    </section>
  )
}
