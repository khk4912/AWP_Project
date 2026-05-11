type SuggestedUser = {
  avatarUrl: string
  description: string
  isFollowing?: boolean
  name: string
}

const currentUser = {
  avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
  handle: '@z_user',
  name: '지윤',
}

const suggestedUsers: SuggestedUser[] = [
  {
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    description: '나를 팔로우함',
    isFollowing: true,
    name: '민준',
  },
  {
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    description: '추천 사용자',
    name: '서연',
  },
  {
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    description: '개발과 디자인 이야기',
    name: '도현',
  },
  {
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    description: '지금 활발히 활동 중',
    name: '하린',
  },
]

function SuggestedUserRow ({ avatarUrl, description, isFollowing = false, name }: SuggestedUser) {
  return (
    <li className='flex items-center justify-between gap-3'>
      <div className='flex min-w-0 items-center gap-3'>
        <img
          src={avatarUrl}
          alt={`${name} 프로필`}
          className='size-[38px] shrink-0 rounded-full object-cover'
        />
        <div className='min-w-0'>
          <p className='truncate text-[14px] font-semibold text-text-primary'>{name}</p>
          <p className='truncate text-[12px] text-text-muted'>{description}</p>
        </div>
      </div>
      <button
        type='button'
        className={`shrink-0 rounded-lg border border-[#323232] px-4 py-2 text-[12px] font-semibold transition-colors ${
          isFollowing
            ? 'text-text-muted hover:text-text-primary'
            : 'text-text-primary hover:bg-white/10'
        }`}
      >
        {isFollowing ? '팔로잉' : '팔로우'}
      </button>
    </li>
  )
}

export function RightRail () {
  return (
    <aside className='hidden w-64 shrink-0 py-[50px] xl:block'>
      <div className='sticky top-[50px] flex flex-col gap-8'>
        <section className='flex items-center justify-between'>
          <div className='flex min-w-0 items-center gap-3'>
            <img
              src={currentUser.avatarUrl}
              alt='내 프로필'
              className='size-[38px] shrink-0 rounded-full object-cover'
            />
            <div className='min-w-0'>
              <p className='truncate text-[14px] font-semibold text-text-primary'>{currentUser.name}</p>
              <p className='truncate text-[13px] text-text-muted'>{currentUser.handle}</p>
            </div>
          </div>
          <button type='button' className='text-[12px] font-semibold text-primary hover:text-sky-300'>
            전환
          </button>
        </section>

        <section>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-[14px] font-semibold text-text-muted'>추천 사용자</h2>
            <button type='button' className='text-[12px] font-semibold text-text-primary hover:text-white'>
              모두 보기
            </button>
          </div>
          <ul className='flex flex-col gap-4'>
            {suggestedUsers.map((user) => (
              <SuggestedUserRow key={user.name} {...user} />
            ))}
          </ul>
        </section>

        <footer className='space-y-4 text-[11px] leading-5 text-text-muted'>
          <p>소개 · 도움말 · 채용 · 개인정보 · 약관</p>
          <p>© 2026 Z</p>
        </footer>
      </div>
    </aside>
  )
}
