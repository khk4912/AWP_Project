import type { ReactNode } from 'react'

type FeedSectionProps = {
  mobileSpacing: 'flush' | 'inset',
  children: ReactNode,
}
export function FeedSection ({ mobileSpacing, children }: FeedSectionProps) {
  return (
    <section
      className={`mx-20 rounded-2xl border border-zinc-800 bg-secondary divide-y divide-zinc-700 ${
        mobileSpacing === 'flush' ? 'not-sm:mx-0' : 'not-sm:mx-4'
      }`}
    >
      {children}
    </section>
  )
}
