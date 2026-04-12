import { MainHeader } from '@/components/MainHeader'

export default function BookmarkPage () {
  return (
    <main className='flex-1 text-white'>
      <MainHeader title='북마크'>
        <div>
          <input
            className='bg-bg py-2 px-6 rounded-2xl'
            type='text' placeholder='검색어를 입력하세요...'
          />
        </div>
      </MainHeader>
    </main>
  )
}
