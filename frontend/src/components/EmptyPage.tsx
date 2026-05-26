import { MainHeader } from './MainHeader'

type EmptyPageProps = {
  description: string
  title: string
}

export function EmptyPage ({ description, title }: EmptyPageProps) {
  return (
    <main className='mx-auto min-h-full w-full max-w-[620px] px-4 sm:px-0'>
      <MainHeader title={title} />
      <section className='flex min-h-[420px] flex-col items-center justify-center text-center'>
        <div className='inline-flex size-14 items-center justify-center rounded-full border border-border-subtle bg-bg-soft text-xl font-bold text-text-primary'>
          G
        </div>
        <h2 className='mt-5 text-[20px] font-bold text-text-primary'>{title}</h2>
        <p className='mt-2 max-w-sm text-[14px] leading-6 text-text-muted'>{description}</p>
      </section>
    </main>
  )
}
