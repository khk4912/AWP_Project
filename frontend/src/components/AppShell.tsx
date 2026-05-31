import DesktopSidebar from './DesktopSidebar'
import MobileBottomNav from './MobileBottomNav'
import RightSidebar from './RightSidebar'
import TopNav from './TopNav'
import type { UserProfile, UserSummary } from '@/lib/types'

type AppShellProps = {
  children: React.ReactNode
  currentUser: UserProfile | null
  users: UserSummary[]
}

export default function AppShell ({ children, currentUser, users }: AppShellProps) {
  return (
    <div className='min-h-screen bg-white'>
      <div className='mx-auto min-h-screen max-w-[1216px] md:flex'>
        <DesktopSidebar currentUser={currentUser} />
        <main className='min-h-screen min-w-0 flex-1 pb-16 md:pb-0'>
          <div className='md:flex md:items-start'>
            <div className='min-w-0 flex-1 xl:w-[42rem] xl:flex-none'>
              <TopNav currentUser={currentUser} />
              {children}
            </div>
            <RightSidebar currentUserId={currentUser?._id} users={users} />
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}
