import AppShell from '@/components/AppShell'
import { getCurrentUser, getFollowRelations, getUsers } from '@/lib/server/api'

export default async function MainLayout ({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  const [currentUser, users] = await Promise.all([
    getCurrentUser(),
    getUsers().catch(() => []),
  ])
  const relations = currentUser != null
    ? await getFollowRelations(currentUser._id).catch(() => null)
    : null
  const followingIds = relations?.following.map((user) => user._id) ?? []

  return (
    <>
      <AppShell currentUser={currentUser} followingIds={followingIds} users={users}>{children}</AppShell>
      {modal}
    </>
  )
}
