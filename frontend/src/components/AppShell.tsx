import DesktopSidebar from './DesktopSidebar'
import MobileBottomNav from './MobileBottomNav'
import MobileTopNav from './MobileTopNav'

export default function AppShell ({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-white'>
      <DesktopSidebar />
      <MobileTopNav />
      <main className='min-h-screen md:pl-56 pb-16 md:pb-0'>
        {children}
      </main>

      <MobileBottomNav />
    </div>
  )
}
