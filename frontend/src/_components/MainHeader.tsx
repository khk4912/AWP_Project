import type { ReactNode } from 'react'

type MainHeaderProps = {
  title: string,
  children?: ReactNode,
}
export function MainHeader ({ title, children }: MainHeaderProps) {
  return (
    <header className='sticky top-0 z-10 mb-8 flex items-center justify-between bg-secondary px-8 py-4 text-white'>
      <h1 className='text-2xl font-bold'>{title}</h1>
      {children != null ? <div>{children}</div> : null}
    </header>
  )
}
