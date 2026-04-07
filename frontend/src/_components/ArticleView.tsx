type ArticleProps = {
  profileImage: string,
  nickname: string,
  date: string,
  title: string,
  content: string,
  // TODO: image, video, etc.
  // attachments: any[],
}
function Article ({ profileImage, nickname, date, title, content }: ArticleProps) {
  return (
    <article className='flex flex-col gap-4 border-1 border-zinc-600 rounded-2xl p-4'>
      <header className='flex items-center gap-4'>
        <img
          src={profileImage}
          alt='Profile Image'
          className='w-12 h-12 rounded-full'
        />
        <div>
          <h2 className='text-lg font-bold'>{nickname}</h2>
          <time className='text-sm text-gray-500'>{date}</time>
        </div>
      </header>
      <h1 className='text-2xl font-bold'>{title}</h1>
      <p className='text-gray-300'>
        {content}
      </p>
    </article>
  )
}

export function ArticleView () {
  return (
    <main className='px-6 py-8 flex-1
                   text-white border-amber-300 border-5
                    grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    >
      <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='octocat' date='2024-06-01' title='Article Title 1' content='Article content 1' />
      <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='octocat' date='2024-06-01' title='Article Title 2' content='Article content 2' />
      <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='octocat' date='2024-06-01' title='Article Title 3' content='Article content 3' />
      <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='octocat' date='2024-06-01' title='Article Title 4' content='Article content 4' />
      <Article profileImage='https://avatars.githubusercontent.com/u/583231?v=4' nickname='octocat' date='2024-06-01' title='Article Title 5' content='Article content 5' />
    </main>
  )
}
