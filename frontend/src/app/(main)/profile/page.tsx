import ProfileClient from './_components/ProfileClient'

export default function ProfilePage () {
  return (
    <section className='min-h-screen max-w-2xl border-x border-gray-200 bg-white pt-16 md:pt-0'>
      <header className='sticky top-16 z-10 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur md:top-0'>
        <h1 className='text-lg font-bold text-gray-950'>프로필</h1>
      </header>
      <ProfileClient />
    </section>
  )
}
