import FeedTabs, { type FeedTab } from './_components/FeedTabs'
import PostComposer from './_components/PostComposer'

function parseFeedTab (tab?: string): FeedTab {
  if (tab === 'following') return 'following'
  return 'recommended'
}

type HomePageProps = {
  searchParams: Promise<{
    tab?: string
  }>
}
export default async function HomePage ({ searchParams }: HomePageProps) {
  const params = await searchParams
  const activeTab = parseFeedTab(params.tab)

  return (
    <section className='min-h-screen max-w-2xl border-x border-gray-200 bg-white pt-16 md:pt-0'>
      <FeedTabs activeTab={activeTab} />
      <PostComposer />
      <div className='flex min-h-[240px] items-center justify-center px-6 text-center text-gray-500'>
        {activeTab === 'following'
          ? '팔로잉 피드가 여기에 표시됩니다.'
          : '추천 피드가 여기에 표시됩니다.'}
      </div>
    </section>
  )
}
