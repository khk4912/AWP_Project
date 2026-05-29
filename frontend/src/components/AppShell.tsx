import DesktopSidebar from './DesktopSidebar'
import MobileBottomNav from './MobileBottomNav'

export default function AppShell ({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-white'>
      <DesktopSidebar />

      <main className='min-h-screen md:pl-72 pb-16 md:pb-0'>
        {children}
      </main>

      <MobileBottomNav />
    </div>
  )
}
