import { notFound } from 'next/navigation'

import { mockCurrentUser, mockUsers } from '@/lib/mock'

import ProfileClient from '../_components/ProfileClient'

type ProfilePageProps = {
  params: Promise<{
    userId: string
  }>
}

export default async function UserProfilePage ({ params }: ProfilePageProps) {
  const { userId } = await params
  const profile = [mockCurrentUser, ...mockUsers].find((user) => user._id === userId)

  if (profile == null) notFound()

  return (
    <section className='min-h-screen max-w-2xl border-x border-gray-200 bg-white pt-16 md:pt-0'>
      <ProfileClient profile={profile} />
    </section>
  )
}
