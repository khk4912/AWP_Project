export default function NotificationsPage () {
  return (
    <section className='min-h-screen max-w-2xl border-x border-gray-200 bg-white pt-16 md:pt-0'>
      <header className='sticky top-16 z-10 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur md:top-0'>
        <h1 className='text-lg font-bold text-gray-950'>알림</h1>
      </header>
      <div className='flex min-h-[240px] items-center justify-center px-6 text-center text-gray-500'>
        아직 새로운 알림이 없습니다.
      </div>
    </section>
  )
}
