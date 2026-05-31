import { notFound } from 'next/navigation'

import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { getFollowRelations, getUser } from '@/lib/server/api'

import ProfileClient from '../_components/ProfileClient'

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

  return (
    <section className='min-h-screen max-w-2xl border-x border-gray-200 bg-white pt-16 md:pt-0'>
      <ProfileClient currentUserId={currentUserId} profile={profile} relations={relations} />
    </section>
  )
}
