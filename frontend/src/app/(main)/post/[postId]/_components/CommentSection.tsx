import Comment from './Comment'
import type { Comment as CommentModel } from '@/lib/types'

type CommentSectionProps = {
  comments: CommentModel[]
}

export default function CommentSection ({ comments }: CommentSectionProps) {
  return (
    <section aria-label='댓글'>
      <h2 className='border-b border-gray-100 px-4 py-3 text-base font-bold text-gray-950'>
        댓글 {comments.length}
      </h2>

      {comments.length > 0
        ? comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))
        : (
          <p className='px-4 py-8 text-center text-sm text-gray-500'>
            아직 댓글이 없습니다.
          </p>
          )}
    </section>
  )
}
