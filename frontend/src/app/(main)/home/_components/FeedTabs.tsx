import Link from 'next/link'

export type FeedTab = 'recommended' | 'following'

type FeedTabsProps = {
  activeTab: FeedTab
}

const tabs = [
  { href: '/home', label: '추천', value: 'recommended' },
  { href: '/home?tab=following', label: '팔로잉', value: 'following' },
] as const

export default function FeedTabs ({ activeTab }: FeedTabsProps) {
  return (
    <nav className='sticky top-16 z-50 grid h-14 grid-cols-2 border-b border-gray-200 bg-white/90 backdrop-blur md:top-0'>
      <span
        aria-hidden='true'
        className={`absolute bottom-0 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[var(--theme-text)] transition-[left] duration-300 ease-out motion-reduce:transition-none ${activeTab === 'following' ? 'left-3/4' : 'left-1/4'} px-10 z-10`}
      />
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value

        return (
          <Link
            key={tab.value}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={`relative flex items-center justify-center text-sm font-semibold transition-colors duration-200 hover:bg-gray-50 motion-reduce:transition-none ${isActive ? 'text-gray-950' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
