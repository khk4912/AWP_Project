const currentUserAvatar = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80'

export function ThreadComposer () {
  return (
    <section className='border-b border-border-subtle px-4 py-5 sm:px-0 sm:py-[30px]'>
      <div className='flex gap-3'>
        <img
          src={currentUserAvatar}
          alt='내 프로필'
          className='size-9 shrink-0 rounded-full object-cover'
        />

        <div className='min-w-0 flex-1'>
          <div className='flex items-center justify-between gap-4'>
            <p className='text-[15px] font-semibold text-text-primary'>지윤</p>
            <button
              type='button'
              className='text-[13px] font-semibold text-primary transition-colors hover:text-sky-300'
            >
              게시
            </button>
          </div>

          <textarea
            className='mt-1 min-h-14 w-full resize-none bg-transparent text-[15px] leading-6 text-text-primary outline-none placeholder:text-text-muted'
            placeholder='새로운 생각을 공유해보세요...'
          />

          <div className='mt-2 flex items-center justify-between border-t border-border-subtle pt-3'>
            <button
              type='button'
              aria-label='첨부'
              className='inline-flex size-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary'
            >
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' className='size-5' aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' d='m8.5 12.5 5.8-5.8a3.2 3.2 0 1 1 4.5 4.5l-7.2 7.2a5 5 0 0 1-7.1-7.1l6.9-6.9' />
              </svg>
            </button>
            <p className='text-[12px] text-text-muted'>모든 사용자가 답글을 남길 수 있어요</p>
          </div>
        </div>
      </div>
    </section>
  )
}
