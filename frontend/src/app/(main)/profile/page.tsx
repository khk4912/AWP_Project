import { redirect } from 'next/navigation'

import { getCurrentUser, getFollowRelations } from '@/lib/server/api'

import ProfileClient from './_components/ProfileClient'

export default async function ProfilePage () {
  const profile = await getCurrentUser()

  if (profile == null) redirect('/login')

  const relations = await getFollowRelations(profile._id).catch(() => null)

  return (
    <section className='min-h-screen max-w-2xl border-x border-gray-200 bg-white pt-16 md:pt-0'>
      <ProfileClient currentUserId={profile._id} profile={profile} relations={relations} />
    </section>
  )
}
