import { notFound } from 'next/navigation'

import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { getFollowRelations, getUser, getUserPosts } from '@/lib/server/api'

import ProfileClient from '../_components/ProfileClient'
import ProfilePosts from '../_components/ProfilePosts'

type ProfilePageProps = {
  params: Promise<{
    userId: string
  }>
}

export default async function UserProfilePage ({ params }: ProfilePageProps) {
  const { userId } = await params
  const token = await getAuthToken()
  const currentUserId = getUserIdFromToken(token)
  const [profile, relations] = await Promise.all([
    getUser(userId).catch(() => null),
    getFollowRelations(userId).catch(() => null),
  ])

  if (profile == null) notFound()

  const posts = await getUserPosts(profile._id).catch(() => [])

  return (
    <section className='min-h-screen w-full border-x border-gray-200 bg-white pt-16 md:pt-0'>
      <ProfileClient currentUserId={currentUserId} profile={profile} relations={relations} />
      <ProfilePosts currentUserId={currentUserId} posts={posts} />
    </section>
  )
}
