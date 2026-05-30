import DesktopSidebar from './DesktopSidebar'
import MobileBottomNav from './MobileBottomNav'
import RightSidebar from './RightSidebar'
import TopNav from './TopNav'

export default function AppShell ({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-white'>
      <div className='mx-auto min-h-screen max-w-[1216px] md:flex'>
        <DesktopSidebar />
        <main className='min-h-screen min-w-0 flex-1 pb-16 md:pb-0'>
          <div className='md:flex md:items-start'>
            <div className='min-w-0 md:w-[42rem]'>
              <TopNav />
              {children}
            </div>
            <RightSidebar />
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}
