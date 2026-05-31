import PostComposer from '../home/_components/PostComposer'
import { getCurrentUser } from '@/lib/server/api'

export default async function WritePage () {
  const currentUser = await getCurrentUser()

  return (
    <section className='min-h-screen bg-white pt-16 md:pt-0'>
      <PostComposer currentUser={currentUser} variant='page' />
    </section>
  )
}
