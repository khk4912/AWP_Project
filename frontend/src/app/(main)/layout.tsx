import AppShell from '@/components/AppShell'
import { getCurrentUser, getUsers } from '@/lib/server/api'

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

  return (
    <>
      <AppShell currentUser={currentUser} users={users}>{children}</AppShell>
      {modal}
    </>
  )
}
