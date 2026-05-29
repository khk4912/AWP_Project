import Post from '@/components/Post'
import type { Post as PostModel } from '@/lib/types'
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

const dummyPosts: PostModel[] = [
  {
    _id: 'post-1',
    author: {
      _id: 'user-minjun',
      username: '민준 ⌘',
      profileImage: '',
    },
    content: `SF Pro Display의 -0.374px letter-spacing은 우연이 아니다.

It's the reason Apple's headlines feel like Apple's headlines. 한 글자 한 글자가 서로를 끌어당긴다.`,
    imageUrl: '',
    likedBy: Array.from({ length: 1300 }, (_, index) => `like-post-1-${index}`),
    commentCount: 42,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    _id: 'post-2',
    author: {
      _id: 'user-hana',
      username: 'Hana Kim',
      profileImage: '',
    },
    content: '오늘의 결론: 본문은 17px가 맞다. 16px로는 절대 안 읽힌다는 게 아니라, 17px는 "읽는 속도"를 바꾼다.',
    imageUrl: '',
    likedBy: Array.from({ length: 312 }, (_, index) => `like-post-2-${index}`),
    commentCount: 28,
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  },
  {
    _id: 'post-3',
    author: {
      _id: 'user-sora',
      username: 'sora',
      profileImage: '',
    },
    content: `cool tones, always.
warm filter 사용하는 사람들 신뢰가 안 감.`,
    imageUrl: '',
    likedBy: Array.from({ length: 891 }, (_, index) => `like-post-3-${index}`),
    commentCount: 134,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'post-4',
    author: {
      _id: 'user-nara',
      username: '나라',
      profileImage: '',
    },
    content: `단 하나의 액션 컬러로 모든 상호작용을 표현하는 시스템.

Less is, surprisingly, more.`,
    imageUrl: '',
    likedBy: Array.from({ length: 2100 }, (_, index) => `like-post-4-${index}`),
    commentCount: 73,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'post-4',
    author: {
      _id: 'user-nara',
      username: '나라',
      profileImage: '',
    },
    content: `단 하나의 액션 컬러로 모든 상호작용을 표현하는 시스템.

Less is, surprisingly, more.`,
    imageUrl: '',
    likedBy: Array.from({ length: 2100 }, (_, index) => `like-post-4-${index}`),
    commentCount: 73,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'post-4',
    author: {
      _id: 'user-nara',
      username: '나라',
      profileImage: '',
    },
    content: `단 하나의 액션 컬러로 모든 상호작용을 표현하는 시스템.

Less is, surprisingly, more.`,
    imageUrl: '',
    likedBy: Array.from({ length: 2100 }, (_, index) => `like-post-4-${index}`),
    commentCount: 73,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'post-4',
    author: {
      _id: 'user-nara',
      username: '나라',
      profileImage: '',
    },
    content: `단 하나의 액션 컬러로 모든 상호작용을 표현하는 시스템.

Less is, surprisingly, more.`,
    imageUrl: '',
    likedBy: Array.from({ length: 2100 }, (_, index) => `like-post-4-${index}`),
    commentCount: 73,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  }
]

export default async function HomePage ({ searchParams }: HomePageProps) {
  const params = await searchParams
  const activeTab = parseFeedTab(params.tab)
  const posts = activeTab === 'following' ? dummyPosts.slice(1, 3) : dummyPosts

  return (
    <section className='min-h-screen max-w-2xl border-x border-gray-200 bg-white pt-16 md:pt-0'>
      <FeedTabs activeTab={activeTab} />
      <PostComposer />
      <div>
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </section>
  )
}
