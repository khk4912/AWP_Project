import { FeedSection } from './FeedSection'
import { MainHeader } from './MainHeader'

type ArticleProps = {
  profileImage: string,
  nickname: string,
  date: string,
  content: string,
  // TODO: image, video, etc.
  // attachments: any[],
}
function Article ({ profileImage, nickname, date, content }: ArticleProps) {
  return (
    <article className='px-4 py-5 sm:px-8 sm:py-6 lg:px-12'>
      <div className='flex items-start gap-4'>
        <div className='flex shrink-0 flex-col items-center'>
          <img
            src={profileImage}
            alt='Profile Image'
            className='h-11 w-11 rounded-full object-cover'
          />
          <div className='mt-3 h-full w-px bg-zinc-800' />
        </div>

        <div className='min-w-0 flex-1'>
          <header className='flex items-start justify-between gap-2'>
            <div className='min-w-0'>
              <div className='flex flex-wrap items-center gap-x-2'>
                <h2 className='truncate text-[15px] font-semibold text-white'>{nickname}</h2>
                <time className='text-sm text-zinc-500'>{date}</time>
              </div>
            </div>

            <button
              type='button'
              aria-label='더보기'
              className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/5 hover:text-white'
            >
              <svg viewBox='0 0 24 24' fill='currentColor' className='h-4 w-4' aria-hidden='true'>
                <circle cx='6' cy='12' r='1.5' />
                <circle cx='12' cy='12' r='1.5' />
                <circle cx='18' cy='12' r='1.5' />
              </svg>
            </button>
          </header>

          <p className='text-[15px] leading-6 text-zinc-300'>
            {content}
          </p>

          <footer className='mt-4 flex items-center gap-1 text-zinc-500'>
            <button
              type='button'
              aria-label='좋아요'
              className='inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/5 hover:text-white'
            >
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' className='h-4 w-4' aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' d='m12 20.25-1.23-1.12C5.55 14.4 2.25 11.39 2.25 7.69A4.44 4.44 0 0 1 6.75 3.2c2 0 3.16.98 4.04 2.02.88-1.04 2.04-2.02 4.04-2.02a4.44 4.44 0 0 1 4.42 4.49c0 3.7-3.3 6.71-8.52 11.44L12 20.25Z' />
              </svg>
            </button>
            <button
              type='button'
              aria-label='댓글'
              className='inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/5 hover:text-white'
            >
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' className='h-4 w-4' aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M8 18.5c-2.76 0-5-2.01-5-4.5s2.24-4.5 5-4.5h8c2.76 0 5 2.01 5 4.5s-2.24 4.5-5 4.5H8Zm0 0L4.5 21v-2.5' />
              </svg>
            </button>
            <button
              type='button'
              aria-label='리포스트'
              className='inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/5 hover:text-white'
            >
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' className='h-4 w-4' aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M17 7h-8.5A3.5 3.5 0 0 0 5 10.5V11m0 0 2.5-2.5M5 11l2.5 2.5' />
                <path strokeLinecap='round' strokeLinejoin='round' d='M7 17h8.5a3.5 3.5 0 0 0 3.5-3.5V13m0 0L16.5 15.5M19 13l-2.5-2.5' />
              </svg>
            </button>
            <button
              type='button'
              aria-label='공유'
              className='inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/5 hover:text-white'
            >
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' className='h-4 w-4' aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M7.5 12.75 16.5 7.5m-9 4.75 9 5.25M18.5 8.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM18.5 20.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM5.5 15a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z' />
              </svg>
            </button>
          </footer>
        </div>
      </div>
    </article>
  )
}

export function ArticleView () {
  return (
    <main className='flex-1
                   text-white '
    >
      <MainHeader title='홈'>
        <div>
          <input
            className='bg-bg py-2 px-6 rounded-2xl'
            type='text' placeholder='검색어를 입력하세요...'
          />
        </div>
      </MainHeader>

      <section className='mx-20 mb-8 flex flex-col not-sm:mx-4'>
        <div className='mb-8 flex flex-col gap-10 rounded-2xl border border-zinc-800 bg-secondary px-12 py-8 not-sm:px-4'>
          <div className='flex gap-8'>
            <img src='https://avatars.githubusercontent.com/u/583231?v=4' alt='Profile Image' className='mb-2 h-10 w-10 rounded-full' />
            <div className='flex w-full flex-col gap-4 divide-y divide-zinc-800'>
              <textarea
                className='h-30 resize-none bg-transparent text-white placeholder:text-gray-500 focus:outline-none'
                placeholder='무슨 일이 일어나고 있나요?'
              />
              <button className='mt-2 self-end rounded-2xl bg-primary px-4 py-2 text-white'>게시</button>
            </div>
          </div>
        </div>
      </section>

      <FeedSection mobileSpacing='flush'>

        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 1' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 2' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 3' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 4' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 5' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 1' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 2' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 3' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 4' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 5' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 1' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 2' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 3' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 4' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 5' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 1' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 2' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 3' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 4' />
        <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='John Doe' date='2024-06-01' content='Article content 5' />
      </FeedSection>
    </main>
  )
}
