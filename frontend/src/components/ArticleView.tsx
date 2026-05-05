import { ThreadComposer } from './ThreadComposer'
import { ThreadPost } from './ThreadPost'

const posts = [
  {
    author: 'donmilli',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    content: 'Just crossed 4,000 followers here. Thanks for making this little corner of the internet feel alive.\nI am dropping a new realtime AR puppet test later this week.',
    likeCount: '32K',
    replyCount: '2,342',
    time: '8h',
    verified: true,
  },
  {
    author: 'arcastic_us',
    avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80',
    content: 'First proper meme on Z. The dark feed actually makes everything feel calmer than I expected.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    likeCount: '12K',
    replyCount: '640',
    time: '12h',
    verified: true,
  },
  {
    author: 'nasdaily',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    content: 'This place is called Sealand. It sits a few kilometers off the coast of the UK.\nTo most people it looked abandoned. To one person, it looked like a country waiting to happen.',
    likeCount: '3K',
    replyCount: '72',
    time: '1d',
    verified: true,
  },
  {
    author: 'mkbhd',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    content: 'The best short-form social apps always come down to density. If the first screen feels right, people stay.',
    likeCount: '4.7K',
    replyCount: '345',
    time: '1d',
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
