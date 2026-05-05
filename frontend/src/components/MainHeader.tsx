import type { ReactNode } from 'react'

type MainHeaderProps = {
  title: string
  children?: ReactNode
}
export function MainHeader ({ title, children }: MainHeaderProps) {
  return (
    <header className='sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border-subtle bg-bg/95 px-4 text-text-primary backdrop-blur sm:px-0'>
      <h1 className='text-[18px] font-bold'>{title}</h1>
      {children != null ? <div className='min-w-0'>{children}</div> : null}
    </header>
  )
}
