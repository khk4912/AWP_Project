import { redirect } from 'next/navigation'

import { getCurrentUser, getFollowRelations, getUserPosts } from '@/lib/server/api'

import ProfileClient from './_components/ProfileClient'
import ProfilePosts from './_components/ProfilePosts'

export default async function ProfilePage () {
  const profile = await getCurrentUser()

  if (profile == null) redirect('/login')

  const [relations, posts] = await Promise.all([
    getFollowRelations(profile._id).catch(() => null),
    getUserPosts(profile._id).catch(() => []),
  ])

  return (
    <section className='min-h-screen w-full border-x border-gray-200 bg-white pt-16 md:pt-0'>
      <ProfileClient currentUserId={profile._id} profile={profile} relations={relations} />
      <ProfilePosts currentUserId={profile._id} posts={posts} />
    </section>
  )
}
