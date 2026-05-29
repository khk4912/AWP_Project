import DesktopSidebar from './DesktopSidebar'
import MobileBottomNav from './MobileBottomNav'
import MobileTopNav from './MobileTopNav'
import RightSidebar from './RightSidebar'

export default function AppShell ({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-white'>
      <MobileTopNav />
      <div className='mx-auto min-h-screen max-w-[1216px] md:flex'>
        <DesktopSidebar />
        <main className='min-h-screen min-w-0 flex-1 pb-16 md:pb-0'>
          <div className='md:flex md:items-start'>
            <div className='min-w-0 md:w-[42rem]'>
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
