import FeedTabs, { type FeedTab } from './_components/FeedTabs'
import HomeFeed from './_components/HomeFeed'
import PostComposer from './_components/PostComposer'

import { getAuthToken, getUserIdFromToken } from '@/lib/auth'
import { getCurrentUser, getFollowingPosts, getPosts } from '@/lib/server/api'

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
  const token = await getAuthToken()
  const currentUserId = getUserIdFromToken(token)
  const currentUser = await getCurrentUser()
  const initialPosts = activeTab === 'following'
    ? await getFollowingPosts(0)
    : await getPosts(0)

  return (
    <section className='min-h-screen w-full border-x border-gray-200 bg-white pt-16 md:pt-0'>
      <FeedTabs activeTab={activeTab} />
      <PostComposer currentUser={currentUser} />
      <HomeFeed activeTab={activeTab} currentUserId={currentUserId} initialPosts={initialPosts} />
    </section>
  )
}
