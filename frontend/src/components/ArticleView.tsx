import { ThreadComposer } from './ThreadComposer'
import { ThreadPost } from './ThreadPost'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

type PostAuthor = {
  _id: string
  username: string
  profileImage: string
}

type Post = {
  _id: string
  author: PostAuthor
  content: string
  imageUrl: string
  likedBy: string[]
  createdAt: string
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}분`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간`
  const days = Math.floor(hours / 24)
  return `${days}일`
}

async function fetchPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/posts`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return data.posts
  } catch {
    return []
  }
}

export async function ArticleView() {
  const posts = await fetchPosts()

  return (
    <div className='mx-auto min-h-full w-full max-w-155 px-0 lg:px-8'>
      <section className='min-w-0 sm:py-0'>
        <header className='sticky top-0 z-10 flex h-14 items-center border-b border-border-subtle bg-bg/95 px-4 backdrop-blur lg:hidden'>
          <h1 className='text-[18px] font-bold text-text-primary'>홈</h1>
        </header>
        <ThreadComposer />
        <section aria-label='Z 피드'>
          {posts.length === 0 ? (
            <p className='px-4 py-10 text-center text-text-muted'>게시글이 없습니다.</p>
          ) : (
            posts.map((post) => (
              <ThreadPost
                key={post._id}
                author={post.author.username}
                avatarUrl={post.author.profileImage}
                content={post.content}
                imageUrl={post.imageUrl || undefined}
                likeCount={post.likedBy.length.toString()}
                replyCount='0'
                time={relativeTime(post.createdAt)}
              />
            ))
          )}
        </section>
      </section>
      {/* <RightRail /> */}
    </div>
  )
}
