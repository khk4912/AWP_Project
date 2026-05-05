import { ThreadComposer } from './ThreadComposer'
import { ThreadPost } from './ThreadPost'

const posts = [
  {
    author: '도널드밀리',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    content: '오늘 팔로워 4,000명을 넘겼어요. 고맙습니다.\n이번 주에는 실시간 AR 퍼펫 실험을 Z에 먼저 공유해볼게요.',
    likeCount: '3.2만',
    replyCount: '2,342',
    time: '8시간',
    verified: true,
  },
  {
    author: '시니컬한_사용자',
    avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80',
    content: 'Z에서 보는 첫 번째 밈. 어두운 화면에 집중되는 피드가 생각보다 편하네요.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    likeCount: '1.2만',
    replyCount: '640',
    time: '12시간',
    verified: true,
  },
  {
    author: '나스데일리',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    content: '오늘은 바다 위에 세워진 작은 구조물 이야기를 읽었어요.\n누군가에게는 버려진 공간이지만, 다른 누군가에게는 완전히 새로운 시작점이 될 수 있더라고요.',
    likeCount: '3천',
    replyCount: '72',
    time: '1일',
    verified: true,
  },
  {
    author: '테크리뷰어',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    content: '짧은 글을 쓰기 좋은 SNS는 결국 첫 화면의 밀도가 결정하는 것 같아요.',
    likeCount: '4.7천',
    replyCount: '345',
    time: '1일',
    verified: true,
  },
]

export function ArticleView () {
  return (
    <div className='mx-auto min-h-full w-full max-w-[620px] px-0 lg:px-8'>
      <section className='min-w-0 sm:py-0'>
        <header className='sticky top-0 z-10 flex h-14 items-center border-b border-border-subtle bg-bg/95 px-4 backdrop-blur lg:hidden'>
          <h1 className='text-[18px] font-bold text-text-primary'>홈</h1>
        </header>
        <ThreadComposer />
        <section aria-label='Z 피드'>
          {posts.map((post, index) => (
            <ThreadPost
              key={`${post.author}-${post.time}`}
              {...post}
              isLast={index === posts.length - 1}
            />
          ))}
        </section>
      </section>
      {/* <RightRail /> */}
    </div>
  )
}
